import React, { useState } from 'react';
import preStyle from './Presentation.module.css';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import ReactMarkdown from 'react-markdown';

const hurl = (error) => { throw new Error(error) }

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
    this.state={};
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(e) {
    this.setState({delta: ({
      ArrowDown: 1,
      ArrowUp: -1,
      ArrowRight: 1,
      ArrowLeft: -1
    })[e.key]})
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  render() {
    const {props: { children, className, match: { path }, mode }, state: { delta } } = this;

    let defaultClassName = [preStyle.presentation];
    if (mode && mode == "captions") defaultClassName = defaultClassName.concat(preStyle.captions);

    return <Route {...{
      path: path + "/:index?/:name?",
      render: ({ match: { params, ...matchetc }, ...etc }) => <div {...{
        className: defaultClassName.concat(className).join(" "),
        style: { gridTemplateAreas: `"${params.name}"` }
      }}>
      {params.index!==undefined && params.index >= 1 && params.index <= children.length?
        React.Children.map(children,
        (child, i) => React.cloneElement(
          child,
          {...etc, match: {...matchetc, path}, index: i + 1}
        )
      ):<Redirect to={path+"/1"}/>}

      {delta && ((Delta) => {
        this.state.delta = 0; // probably a crime, but doesn't cause a state change
       return <Redirect to={`${path}/${+params.index+Delta}`}/>
      })(delta)}
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

const Slide = ({ index, children, className, name, match: { path } }) => <div {...{
  className: [preStyle.slide].concat(className).join(" "),
  style: { gridArea: name }
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


