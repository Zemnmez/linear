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
  </Slide>

  <Slide {...{ name: "about" }}>
    about
  </Slide>
</Presentation>

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
