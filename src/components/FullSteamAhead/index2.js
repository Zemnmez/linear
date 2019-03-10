class Presentation extends React.Component {
}




class SlideController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.observer = suspendedConstructor(IntersectionObserver);
    this.state = { index: props.index }

    this.childVisibilityStats = new Map();

    // still cant believe this is the best way to do this
    this.childWillUnmount = this.childWillUnmount.bind(this);
    this.parentWillUnmount = this.parentWillUnmount.bind(this);

    this.parentDidMount = this.parentDidMount.bind(this);
    this.childDidMount = this.childDidMount.bind(this);

    this.childIndexes = new Map();

    this.afterMount = [];
  }

  childWillUnmount({index, element}) {
    this.observer.unobserve(element)
    this.childIndexes.delete(index);
  }

  childDidMount({index, element}) {
    this.observer.observe(element)
    this.childIndexes.set(index, element);
  }

  scrollTo(element) { scrollIntoView(element); }
  elemByIndex(index) { return this.childIndexes.get(index) }
  indexByElem(elem) {
    const reverseMap = new Map([...this.childIndexes].map(([a,b])=>[b,a]))
    console.log(reverseMap);
    console.log(elem, reverseMap.get(elem));
    return reverseMap.get(elem)
  }

  scrollToIndex(index) {
    console.log(this.childIndexes, this.childIndexes.get(index));
    scrollIntoView(this.childIndexes.get(index))
  }

  componentDidMount() {
    this.props.index && this.scrollToIndex(this.props.index);
  }

  scrollDidEnd() {
    const mostVisible = this.getMostVisible();
    this.scrollTo(mostVisible.target);
  }

  parentWillUnmount(root) {
    this.observer.disconnect()
  }

  parentDidMount(root) {
    this.observer(
        this.childVisibilityDidChange.bind(this),
        { root, threshold: [ 0, 0.5, 1 ] }
    );
  }

  childVisibilityDidChange(ev) {
    [].forEach.call(ev, (ev) => this.childVisibilityStats.set(ev.target, ev));
    const index = this.indexByElem(this.getMostVisible().target);
    this.setState({index});
  }

  getMostVisible() {
    return [...this.childVisibilityStats].map(([a,b])=>b).sort(({ intersectionRatio: a }, { intersectionRatio: b }) => a-b).pop();
  }

  render() {
    const { props: { children, path, ...etc }, state: { } } = this;
    return <React.Fragment>
      <ChildAndParentTracker {...{
      childWillUnmount: this.childWillUnmount,
      childDidMount: this.childDidMount,
      willUnmount: this.parentWillUnmount,
      didMount: this.parentDidMount,
      children,
      ...etc
    }}/>
    </React.Fragment>
  }
}

/*
<ChildAndParentTracker {...{
  render: ({parent, children}) =>
    <ReactIntersectionObserver {...{
      render: ({ entries }) =>
        <ChildObserver
}}/>
*/

class SwapSlideURL extends React.PureComponent {
  static contextType = SlideControllerContext;
  render() {
    return this.context.redirectToSlide({ index: this.props.index, stateChange: false });
  }
}

class RedirectToSlide extends React.PureCompoenent {
  static contextType = SlideControllerContext;
  render() {
    return this.context.redirectToSlide({ index: this.props.index, stateChange: true });
  }
}

class SlideLocationController extends React.PureComponent {
  render() {
    render <Route {...{
      path: this.props.path + "/:index",
      render: ({ match, location, history }) =>
        <SlideControllerImpl {...{
          match, location, history, ...this.props
        }}/>
    }}/>
  }
}

const SlideControllerContext = React.createContext(null);
class SlideControllerImpl extends React.PureComponent {

  render() {
    return <SlideControllerContext.Provider {this.context}>
    <ChildAndParentTracker {...{
    render: ({parent, children}) =>
      <ReactIntersectionObserver {...{
      parent, children,
      render: ({ entries }) =>
        <VisibilityObserver {...{
        entries,
        render: ([mostVisible]) =>
          match.params.index != mostVisible.index?
          <SwapSlideURL {...{index: mostVisible.index }}/>:""
        }}/>
      }}/>
    }}>
    {children}
    </ChildAndParentTracker>
    </SlideControllerContext.Provider>
}

class SlideVisibilityController extends React.Component {
  render() {
    const { path, mostVisible , match } = this.props;

    return match.params.index != mostVisible.index?
      <RedirectToSlide {...{
        index: mostVisible.index,
      }}: "";
  }
}

class VisibilityObserver extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const visibilityRanking =
      this.props.entries.map((entry, index) =>
        ({entry, index})).sort(({entry: {
          intersectionRatio: a
        }}, {entry: {
          intersectionRatio: b
        }}) => a - b);

    return render({visibilityRanking});
  }
}

class ReactIntersectionObserver extends React.PureComponent {
  constructor(props) {
    super(props);

    this.observer = undefined;
  }

  intersectionChanged(IntersectionEntries) {
    const entries = this.state.entries;
    IntersectionEntries.forEach(entry =>
      this.state.entries[
        this.props.children.indexOf(entry.target)
      ] = entry);

    this.setState({ entries });
  }

  replaceObserver() {
    this.observer && this.observer.disconnect();
    this.observer = new IntersectionObserver (
      this.intersectionChanged.bind(this),
      {
        root: this.props.parent,
        threshold: this.props.threshold,
      }
    );

  }

  componentDidUpdate(oldProps, oldState) {
    // need to rebuild the observer
    if (oldProps.parent != props.parent
      || oldProps.threshold != props.threshold)
      return replaceObserver()

    const old = new Set(oldProps.children);
    const New = new Set(this.props.children);

    New.forEach(v =>
      (!old.has(v))&&this.observer.observe(v));

    old.forEach(v =>
      (!New.has(v))&&this.observer.unobserve(v));

  }

  render() {
    this.props.parent && this.replaceObserver();
    const { entries } = this.state;
    return this.props.render({entries});
  }
}

//ChildAndParentTracker exposes a <div> element that pushes
//up state when it, or its children are mounted or unmounted.
//Most props are forwarded to the <div> itself.
class ChildAndParentTracker extends React.PureComponent {
  constructor(props) {
    super(props);

    // won't be available until we actually mount
    // that's why it's suspended.
    this.myRef = React.createRef();
    this.state = {
        parent: undefined,
        children: []
    }
  }

  componentDidMount() {
    const parent = this.myRef.current
    this.setState({parent});
  }
  componentWillUnmount() {
    const parent = undefined;
    this.setState({parent});
  }

  childDidMount(index, element) {
    const children = this.state.children;
    children[index] = element;
    this.setState({children});
  }

  childWillUnmount(index, element) {
    const children = this.state.children;
    children[index] = undefined;
    this.setState({children})
  }

  render() {
    const { props: { render, children, ...etc }, myRef: ref } = this;
    return <div {...{
      ref,
      ...etc
    }}>
      {(({parent,children)=>
        render({parent,children}))(this.state)}

      {React.Children.map(children, (child, i) =>
        child && <TrackableChild {...{
            didMount: this.childDidMount.bind(this, i),
            willUnmount: this.childWillUnmount.bind(this, i)
        }}>{child}</TrackableChild>
      )}
    </div>
  }
}

class TrackableChild extends React.PureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() { this.props.didMount(this.myRef.current); }
  componentWillUnmount() { this.props.willUnmount(this.myRef.current); }

  render() {
    return React.cloneElement(
      React.Children.only(this.props.children),
      { ref: this.myRef }
    );
  }
}
