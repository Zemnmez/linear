import React, { Suspense } from 'react';
import './App.css';
import style from './App.module.css';
import bio from '@zemnmez/bio';
import {
  BrowserRouter as Router,
  Route,
  //Link,
  Switch,
  Redirect
} from 'react-router-dom';

import ReactGA from 'react-ga';


//import Timeline from '../Timeline';



import Load from 'components/Load';
const AsyncCV = React.lazy(() => import("components/CV"));
const AsyncHome = React.lazy(() => import("components/Home"));
const AsyncThrace = React.lazy(() => import("components/Thrace"));
const AsyncFullSteamAhead = React.lazy(() => import("components/FullSteamAhead"));
const AsyncGo = React.lazy(() => import("components/Go"));
const AsyncPetals = React.lazy(() => import("components/Art/Apr2nd2019"));

ReactGA.initialize('UA-134479219-1');
ReactGA.pageview(window.location.pathname + window.location.search);


const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const parseSimpleDate = (date) => {
    let [month, day, year] = date.split(" ");
    month = months.indexOf(month);

    if (month === -1) throw Error(`invalid date ${date}`);

    return new Date(year, month, day);
}

const Delay = ({ time, children }) => {
  const [display, setDisplay] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setDisplay(true), time);
    return () => clearTimeout(timer);
  })

  if (!display) return <React.Fragment/>

  return children;
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {data: App.parseDates(bio)};
  }

  static parseDates(data) {
    data.timeline = data.timeline.map(({date, ...etc}) => {
      date = parseSimpleDate(date);

      return ({date, ...etc});
    });

    return data;
  }

  render() {
    if (!this.state.data) return "";
    const className = style.App;
    return (
        <Router>
      <Suspense fallback={<Delay time={1000}><Load {...{
        className
      }}/></Delay>}>
        <Switch>

        <Route exact path="/" render={() => <AsyncHome {...{
          data: this.state.data,
          className
        }}/>}/>

        <Route exact path="/generative/petals" {...{
          render: () => <AsyncPetals {...{
            className
          }}/>
        }}/>

        <Route exact path="/generative/load" {...{
          render: () => <Load {...{
            className
          }}/>
        }}/>

         <Route path="/talk/full-steam-ahead/" {...{
            render: ({ ...etc }) => <AsyncFullSteamAhead {...{
              className,
              mode: "slides",
              ...etc
            }}/>
          }}/>

          <Route {...{
            path: "/go",
            render: ({ ...etc }) => <AsyncGo {...{ className, ...etc }}/>
          }}/>

          <Route exact path="/thrace" render={() => <AsyncThrace {...{
            className
          }}/>}/>

            <Route exact path="/cv/" render={({ location: { search } }) => {
              const params = new Map(
                search.slice(1).split("&").map(param =>
                  param.split("=").map(decodeURIComponent)));

              return <AsyncCV {...{
                data: this.state.data,
                className,
                phone: params.get("phone"),
                email: params.get("email")
              }} />
            }}/>

            <Route path="/cv/" render={() => <Redirect to="/cv/"/>}/>

            <Route render={() => <Redirect to="/"/>}/>
            </Switch>
            </Suspense>
        </Router>
    );
  }
}


export default App;
