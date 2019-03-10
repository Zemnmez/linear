import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import React from 'react';
import {
  Route, Redirect, generatePath
} from 'react-router-dom';
import style from './Presentation.module.css';
import 'intersection-observer';
import urlJoin from 'url-join';

// looks like non-relative import paths dont work with
// babel macros
import log from '../../macros/log.macro';
import assert from '../../macros/assert.macro';

assert(1 == 2);

const hurl = (error) => { throw new Error(error) }

export class Presentation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.pathFormat = urlJoin(this.props.match.path, ":index");
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
        {children}
        </ChildAndParentTracker>
    }}/>
  }
}

class SlideController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { scrollTo: this.props.match.index, updateUrlFor: undefined };
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
    if (this.props.match)
    if (!this.oldProps || (this.props.match.index != this.oldProps.match.index))
      newState = { ...newState, scrollTo: this.props.match.index };

    // most visible element changed, change url
    if (this.props.mostVisible)
    if (!this.oldProps || (this.props.mostVisible.index != this.oldProps.mostVisible.index))
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
    const entries = this.state.entries;
    log("intersection changed", entries);
    IntersectionEntries.forEach(entry =>
      this.state.entries[
        this.props.children.indexOf(entry.target)
      ] = entry);

    this.setState({ entries });
  }

  replaceObserver() {
    log("(re)creating observer");
    this.observer && this.observer.disconnect();
    this.observer = new IntersectionObserver (
      this.intersectionChanged.bind(this),
      {
        root: this.props.parent,
        threshold: this.props.threshold,
      }
    );

    this.props.children.forEach((child) => this.observer.observe(child));

  }

  componentDidUpdate(oldProps, oldState) {
    log("visibility change detected", {old: oldProps, New: this.props});
    // need to rebuild the observer
    if (oldProps.parent != this.props.parent
      || oldProps.threshold != this.props.threshold) {
      log("need to rebuild IntersectionObserver due to change in parent or threshold");
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
