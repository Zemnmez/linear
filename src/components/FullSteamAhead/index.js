import React from 'react';
import preStyle from './Presentation.module.css';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

// praxis: every slide renders, css grid determines how
export default () => <Presentation>
  <Slide {...{ name: "welcome" }}>
    welcome!
    <Caption>

    </Caption>
  </Slide>

  <Slide {...{ name: "about" }}>
    about
    <Caption>
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
    </Caption>
  </Slide>
</Presentation>

const Caption = ({ children }) => React.Children.only(children);

const Welcome = ({ className }) => <div {...{
    className: [preStyle.slide].concat(className).join(" ")
  }}>

</div>

const Presentation = ({ children }) => <Router>
  <Switch>
    <Route {..{
      path: "/:slideId/:slideName?",
      render: ({ match: { params: { slideId, slideName } } }) => {
        // easy case
        if (children[+slideId]) return children[+slideId];
      }}/>
  </Switch>
</Router>

const Slide = ({ name, className, children }) => {
  const canonicalName = name.replace(/ /g, "-");

  return <div {...{
    className: [preStyle.slide].concat(className).concat(canonicalName).join(" "),
    style: { gridArea: canonicalName }
  }}>

  {children}
  </div>
}
