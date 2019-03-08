import React, { useState } from 'react';
import preStyle from './Presentation.module.css';
import Hammer from 'hammerjs';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import ReactMarkdown from 'react-markdown';

const hurl = (error) => { throw new Error(error) }

// a simple throttle that *does not* keep
// an event stack i.e. only the last event
// is fired.
const throttle = (fn, milliseconds) => {
  let timeout;
  return (...args) => {
    if (timeout) timeout = window.cancelTimeout(timeout);
    timeout = window.setTimeout(fn.bind(0, ...args), milliseconds);
  };
}

const Markdown = ReactMarkdown;

// praxis: every slide renders, css grid determines how
export default ({...etc}) => <Presentation {...{
    ...etc
  }}>
  <Slide {...{ name: "welcome" }}>
    <Title>1. Welcome!</Title>
    <Caption>
      <Markdown {...{ source: `

hello everyone! I heard this was an offensive convention so I wanted to start by saying 'fuck'.

this talk is about modern web & desktop application design, its pros, its cons and its
pitfalls at least partially by example. I'll demonstrate techniques that result in serious
compromise or remote code execution.

      `}}/>
    </Caption>
  </Slide>

  <Slide {...{ name: "about" }}>
    <Title>2. Modern Applications</Title>
    <Caption>
  <Markdown {...{ source: `
The dim air is filled with smoke and laughter. An old, one-eyed man
speaks to you from behind an aged beverage.

"back in my day, things were much simpler. more secure. none of this
'react' nonsense or whatever. developers didn't go chasing the
shinest libraries. just used the stuff we knew was good."


And there's the thing: I feel like the perception of these new-fangled
ways to develop applications is one of unknowning and fear.

Here's how I think of it: every design choice comes with a set of secrity
characteristics. You need to know yours.

While it is absolutely true that these newfangled tools are less well-trodden,
they also have the opportunity -- and in the best cases capitalise on this --
to change the security landscape in the most important way: changing the
abstraction to take insecure modes of operation out of the equation
  `}}/>
    </Caption>
  </Slide>

</Presentation>

const Title = ({ children }) => <h1> {children} </h1>;

class Presentation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { mostVisibleSlide: undefined };
    this.onKeyDown = this.onKeyDown.bind(this);
    this.selfRef = React.createRef();
    this.slideVisibilityTracker = new Map();
    this.updateVisibleSlide = throttle(this.updateVisibleSlide, 200);
    this.childElements = [];
    this.slideDidBecomeVisible = this.slideDidBecomeVisible.bind(this);
  }

  slideElementWasCreated(slideElement) {
    this.childElements = this.childElements.concat(slideElement);
  }

  componentDidMount() {
    this.slideIntersectionObserver = new IntersectionObserver(
      this.slideDidBecomeVisible,
      {root: this.selfRef.current}
    )

    this.childElements.forEach(
      this.slideIntersectionObserver.observe.bind(
        this.slideIntersectionObserver
      )
    );
  }

  componentWillUnmount() {
    this.slideIntersectionObserver &&
      this.slideIntersectionObserver.disconnect();
  }

  onKeyDown(e) {
    this.setState({delta: ({
      ArrowDown: 1,
      ArrowUp: -1,
      ArrowRight: 1,
      ArrowLeft: -1
    })[e.key]})
  }

  // slideDidBecomeVisible is used to implement two scroll-based snapping features:
  // updating the URL of the page as slides go in and out of visibility,
  // and snapping to a particular slide when scrolling ends.
  //
  // whenever an IntersectionObserver event is sent for a slide index,
  // we record it against its index, replacing any existing event.
  //
  // We wait for both requestAnimationFrame and requestIdleCallback to find
  // (1) the next time the page would be redrawn (as a form of throttling)
  // and (2) the next time there is idle time.
  //
  // Once this happens, we find the IntersectionObserver event with the
  // highest intersection ratio (taking up most of the space), and
  // ensure that the location is updated, if not already at that index,
  // to the slide at that index.
  //
  // Lastly, we queue an event for when scrolling stops i.e. there hasn't
  // been a recent scroll event and the user is not touching the scren.
  // this event tweens the scroll of this, the parent element until the
  // child is fully in view. The tween is immediately cancelled if another
  // scroll event begins or the user touches the screen.
  slideDidBecomeVisible(IntersectionObserverEntry) {
    console.log(IntersectionObserverEntry);
    this.slideVisibilityTracker.set(
      IntersectionObserverEntry.target,
      IntersectionObserverEntry
    )
  }

  updateVisibleSlide() {
    const { slideVisibilityTracker } = this;
    const [mostVisibleTarget] = [...slideVisibilityTracker].sort( (
        [element, { intersectionRatio: a }],
        [element2, { intersectionRatio: b }]
      ) => a - b
    );

    const mostVisibleSlide = mostVisibleTarget.getAttribute("index");

    this.setState({mostVisibleSlide});
  }

  // used for snapping. see the comment for slideDidBecomeVisible.
  onScroll(event) {

  }

  render() {
    const {props: { children, className, match: { path }, mode }, state: { delta }, selfRef } = this;

    let defaultClassName = [preStyle.presentation];
    if (mode && mode == "captions") defaultClassName = defaultClassName.concat(preStyle.captions);

    return <Route {...{
      path: path + "/:index?/:name?",
      render: ({ match: { params, ...matchetc }, ...etc }) => <div {...{
        ref: selfRef,
        className: defaultClassName.concat(className).join(" ")
      }}>
      {params.index!==undefined && params.index >= 1 && params.index <= children.length?
        React.Children.map(children,
        (child, i) => React.cloneElement(
          child,
          {
            ...etc,
            match: {...matchetc, path},
            index: i + 1,
            elementWasCreated: (element) =>
              this.slideElementWasCreated(element)
          }
        )
      ):<Redirect to={path+"/1"}/>}

      {delta && ((Delta) => {
        this.state.delta = 0; // probably a crime, but doesn't cause a state change
       return <Redirect to={`${path}/${+params.index+Delta}`}/>
      })(delta)}

      {this.mostVisibleSlide && (params.index != this.mostVisibleSlide) && <Redirect {...{
        to: `${path}/${this.mostVisibleSlide}`
      }}/> }

      </div>
    }}/>
  }
}

const Caption = ({ children, className }) => <div {...{
  className: [preStyle.caption].concat(className).join(" ")
  }}>

  {children}
</div>

const canonicalizeName = (name) => name.replace(/ /g, "-");

class Slide extends React.Component {

  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  componentDidMount() {
    const { props: { elementWasCreated, index } } = this;

    this.myRef.current.setAttribute("data-index", index);

    elementWasCreated(this.myRef.current);
  }


  render() {
  const {
    props: { index, children, className, name, match: { path } },
    myRef
  } = this;

  return <div {...{
  className: [preStyle.slide].concat(className).join(" "),
  style: { /* gridArea: name */ },
  ref: myRef
  }}>



  <Switch>
    <Route {...{
      exact: true,
      path: path + `/${index}/${name}`,
    }}/>

    <Route {...{
      path: path + `/${index}/`,
      render: () => <Redirect to={path + `/${index}/${name}`}/>
    }}/>
  </Switch>

  {children}
</div>

  }
}

