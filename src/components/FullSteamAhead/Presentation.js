import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import React from 'react';
import {
  Route, Redirect, generatePath
} from 'react-router-dom';


class Presentation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.pathFormat = `${this.props.location.path}/:index`;
  }

  render() {
    const { ...etc } = this.props;
    render <Route {...{
      path: this.pathFormat,
      render: ({ match, location, history }) =>
        <ChildAndParentTracker {...{
        ...etc,
        render: ({parent, children}) =>
          <ReactIntersectionObserver {...{
          parent, children,
          render: ({ entries }) =>
            <VisibilityObserver {...{
            entries,
            render: ([mostVisible]) =>
              <SlideController {...{
                match, location, history
                parent, children,
                entries, mostVisible,
                pathFormat: this.pathFormat
              }}/>
            }}/>
          }}/>
        }}>
        {children}
        </ChildAndParentTracker>
    }}/>
  }
}

class SlideController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { scrollTo, updateUrlFor };
  }

  showSlide(index) { return this.scrollToIndex(index) }
  scrollToSlide({ index }) { scrollIntoView(this.slideBy({ index })) }

  slideBy({ index }) {
    const target = this.props.children[index];
    if (!target) hurl(`cant find slide ${index} :(`);
    return target;
  }

  componentDidUpdate(oldProps, oldState) {
    let newState = {};
    // url changed, scroll to thing
    if (this.props.match.index != this.oldProps.match.index)
      newState = { ...newState, scrollTo: this.props.match.index };

    // most visible element changed, change url
    if (this.props.mostVisible.index != this.oldProps.mostVisible.index)
      newState = { ...newState, updateUrlFor: this.props.mostVisible.index };

    this.setState({...newState});
  }

  render() {
    if (this.state.scrollTo) this.scrollToSlide({ index: this.state.scrollTo });
    if (this.state.updateUrlFor) return <Redirect {...{ to: this.slidePath(this.state.updateUrlFor) }}/>
    return "";
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
