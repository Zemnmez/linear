import React from 'react';
import './App.css';
import style from './App.module.css';
import bio from 'bio/bio.json';
import {
  BrowserRouter as Router,
  Route,
  //Link,
  Switch,
  Redirect
} from 'react-router-dom';



//import Timeline from '../Timeline';


import Loadable from 'react-loadable';
import Loading from 'react-loading';

const AsyncCV = Loadable({
  loader: () => import("components/CV"),
  loading: Loading,
  render(loaded, {data, className, phone, email}) {
    let Component = loaded.default;
    return <Component {...{data, className, phone, email}}/>
  }
});


const AsyncHome = Loadable({
  loader: () => import("components/Home"),
  loading: Loading,
  render(loaded, {data, className, phone, email}) {
    let Component = loaded.default;
    return <Component {...{data, className, phone, email}}/>
  }
});


const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const parseSimpleDate = (date) => {
    let [month, day, year] = date.split(" ");
    month = months.indexOf(month);

    if (month === -1) throw Error(`invalid date ${date}`);

    return new Date(year, month, day);
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

  componentDidMount() {
    /*
    fetch("https://raw.githubusercontent.com/Zemnmez/bio/master/bio.json?" + Math.random())
      .then(r => r.json(), (error) => {
        console.log(error);
        return bio;
      })
      .then(data => App.parseDates(data))
      .then(data => this.setState({data}))
    */
  }

  componentWillUnmount() {
  }


  render() {
    if (!this.state.data) return "";
    const className = style.App;
    return (
        <Router>
          <Switch>
          <Route exact path="/" render={() => <AsyncHome {...{
            data: this.state.data,
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

        </Router>
    );
  }
}


export default App;
