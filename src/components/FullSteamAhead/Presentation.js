import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import React from 'react';
import {
  Route, Redirect, generatePath
} from 'react-router-dom';
import style from './Presentation.module.css';
import 'intersection-observer';
import urlJoin from 'url-join';
import { List } from 'immutable';

// looks like non-relative import paths dont work with
// babel macros
import log from '../../macros/log.macro';
import assert from '../../macros/assert.macro';

const hurl = (error) => { throw new Error(error) }

const SlideIndexContext = React.createContext(undefined);
const IndexContext = React.forwardRef(({children, value, ...etc}, ref) =>
  <SlideIndexContext.Provider {...{
    value,
    children: React.cloneElement(
      React.Children.only(children),
      { ref }
    )
  }}/>);
export class Presentation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.pathFormat = urlJoin(this.props.match.path, "/:index?");
  }

  render() {
    const { children, className, ...etc } = this.props;
    return <Route {...{
      path: this.pathFormat,
      render: ({ match, location, history }) =>
        <ChildAndParentTracker {...{
        className: [style.presentation].concat(className).join(" "),
        ...etc,
        render: ({parent, children}) =>
          <ReactIntersectionObserver {...{
          parent, children,
          render: ({ entries }) =>
            <VisibilityObserver {...{
            entries,
            render: ({visibilityRanking: [mostVisible]}) =>
              <SlideController {...{
                match, location, history,
                parent, children,
                entries, mostVisible,
                pathFormat: this.pathFormat
              }}/>
            }}/>
          }}/>
        }}>
        {React.Children.map(children, (child, i) => <IndexContext
          value={i+1}>{child}</IndexContext>)}
        </ChildAndParentTracker>
    }}/>
  }
}

export const SlideIndex = ({ className, ...etc }) => <span {...{
  className: [style.slideIndex].concat(className).join(" "),
  ...etc
}}/>

class CustomSlideIndex extends React.PureComponent {
  static contextType = SlideIndexContext;
  render() {
    let { render } = this.props;
    assert(render !== undefined);

    return render(this.context);
  }
}

class SlideController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.slidePath = this.slidePath.bind(this);
    this.slideBy = this.slideBy.bind(this);
  }

  slidePath({ index }) { return generatePath(this.props.pathFormat, {index}) }

  slideBy({ index }) {
    const target = this.props.children[index];
    if (!target) hurl(`cant find slide ${index} :(
    nb: slideBy slides are zero-indexed`);
    return target;
  }

  render() {
    const { props: { mostVisible, location, match }, slidePath, slideBy } = this;
    log({...this});
    if (match.params.index == undefined) return <Redirect {...{
        to: slidePath({ index: 1 })
      }}/>
    return <React.Fragment>
      {/*<SlideHotkeyController {...{
        slidePath,
        slideBy
      }}/>*/}
      {this.props.mostVisible !== undefined? <IndexChangeRedirector {...{
        index: mostVisible.index + 1,
        slidePath: slidePath
      }}/>:""}
    {/* this just ensures that the children are loaded in before we try to jump to one */}
    {this.props.children.length > 0? <IndexChangeScroller {...{
        state: location.state,
        index: match.params.index,
        slideBy
      }}/>:""}
    </React.Fragment>
  }
}

class IndexChangeScroller extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { index } = this.props;
    if (!nextProps.state) return true;
    return (!nextProps.state.fromIndexChange) && nextProps.index != index
  }

  render() {
    log("scroll to", { target: this.props.index });
    return <ScrollTo {...{
      target: this.props.slideBy({index: this.props.index - 1 })
    }}/>
  }
}

class ScrollTo extends React.PureComponent {

  throttle;
  render() {
    const { target, ...etc } = this.props;
    this.throttle&&clearTimeout(this.throttle);
    // hack to wait until css is rendered (probably)
    // i would use fragment but fucking react-router doesnt support it
    // and also it would mean injecting ids into child elements which i dont like
    this.throttle = setTimeout(() => scrollIntoView(target), 100);
    return "";
  }
}

class IndexChangeRedirector extends React.PureComponent {
  /*
  componentDidUpdate(oldProps, oldState) {
    this.old = oldProps.index;
    this.New = this.props.index;
    // calling setState caused this to be called twice each time ...
    // which broke the old / new diffing
    //this.setState({ old: oldProps.index, New: this.props.index });
  }*/

  constructor(props) {
    super(props);
    this.state = { old: undefined, New: this.props.index }
  }


  static getDerivedStateFromProps(props, state) {
    if ( props.index == state.New ) return;
    const [ old, New ] = [ state.New, props.index];
    assert( old != New, { old, New });
    return { old, New };
  }

  render() {
    const { props: { index, slidePath }, state: {old, New} } = this;
    log({ index });
    log({ old, New });
    return New !== undefined ?<Redirect {...{
      to: {
        pathname: slidePath({ index: New }),
        state: { fromIndexChange: true }
      },
      from: old !== undefined ?slidePath({ index: old }): undefined
    }}/>:""
  }
}


class VisibilityObserver extends React.PureComponent {
  render() {
    const visibilityRanking = this.props.entries.map((entry, index) =>
        ({entry, index})).sort(({entry: {
          intersectionRatio: a
        }}, {entry: {
          intersectionRatio: b
        }}) => b - a);

    log({visibilityRanking})
    log("most visible slide", [...visibilityRanking][0]);

    return this.props.render({visibilityRanking});
  }
}

class ReactIntersectionObserver extends React.PureComponent {
  constructor(props) {
    super(props);

    this.observer = undefined;
    this.state = { entries: [] };
  }

  intersectionChanged(IntersectionEntries) {
    log();
    let entries = [...this.state.entries];
    IntersectionEntries.forEach(entry =>
      entries[
        this.props.children.indexOf(entry.target)
      ] = entry);

    entries = List(entries);
    log({ entries });

    this.setState({ entries });
  }

  replaceObserver() {
    log();
    this.observer && this.observer.disconnect();
    this.observer = new IntersectionObserver (
      this.intersectionChanged.bind(this),
      {
        root: this.props.parent,
        threshold: this.props.threshold || [ 0, .5, 1],
      }
    );

    this.props.children.forEach((child) => {
      log("observe", child);
      this.observer.observe(child)
    });

  }

  componentDidUpdate(oldProps, oldState) {
    log({old: oldProps, New: this.props});
    // need to rebuild the observer
    if (oldProps.parent != this.props.parent
      || oldProps.threshold != this.props.threshold) {
      log("rebuilding observer", {
        parents: { old: oldProps.parent, New: this.props.parent},
        thresholds: { old: oldProps.threshold, new: this.props.threshold}
      });
      return this.replaceObserver()
    }

    const old = new Set(oldProps.children);
    const New = new Set(this.props.children);

    log("intersecting element tracking sets", {old, New});


    New.forEach(v => {
      if (!old.has(v)) {
        log("observing new", v);
        this.observer.observe(v);
      }
    });

    old.forEach(v => {
      if (!New.has(v)) {
        log("unobserving old", v);
        this.observer.unobserve(v);
      }
    });

  }

  componentDidMount() {
    this.props.parent && this.replaceObserver();
  }

  componentWillUnmount() {
    this.observer = this.observer.disconnect();
  }

  render() {
    const { entries } = this.state;
    return this.props.render({entries: List(entries)});
  }
}

//ChildAndParentTracker exposes a <div> element that pushes
//up state when it, or its children are mounted or unmounted.
//Most props are forwarded to the <div> itself.
class ChildAndParentTracker extends React.Component {
  constructor(props) {
    super(props);

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
      {(({parent,children})=>
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

export const TitleGroup = ({ children, className, ...etc }) => <div {...{
  className: [style.titleGroup].concat(className).join(" "),
  ...etc
}}> {children} </div>

export const Notes = ({ children, className, ...etc }) => <div {...{
  className: [style.notes].concat(className).join(" "),
  ...etc
}}> {children} </div>

export const BackgroundYoutube = ({ video, className, options, ...etc }) => <iframe {...{
  src: `//youtube.com/embed/${encodeURIComponent(video)}?${
      Object.entries({
        loop: 1,
        playlist: video,
        autoplay: 1,
        controls: 0,
        mute: 1,
        ...options
      }).map(([key, value]) => [key, value].map(encodeURIComponent).join("=")).join("&")
    }`,
  frameborder: 0,
  allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
  className: [].concat(className).join(" ")
}}/>
