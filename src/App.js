import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const morning = [6, 0];
const night = [20, 0];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {data: undefined};
  }

  phase() {
    const now = new Date;

    let setTime = (date, [Hours, Minutes]) => {
      Object.entries({Hours, Minutes}).forEach(([k, v]) => date["set"+k](v));
      return date;
    }

    const morning = setTime(new Date(+now), morning);
    const night = setTime(new Date(+now), night);


  }

  componentDidMount() {
    fetch("https://raw.githubusercontent.com/Zemnmez/bio/master/bio.json?"+Math.random())
      .then(r => r.json())
      .then(data => this.setState({data}));
  }


  render() {
    if (!this.state.data) return "";
    return (
      <div className="App">
        <VideoBackground />
        <header> <div className="innerText">{this.state.data.who.handle}</div> </header>
        <article> <Profile data={this.state.data} /> </article>
      </div>
    );
  }
}

let Profile = ({data: {who, timeline, links}}) => <div className="profile">
  <ProfileHeader {...{who, links}}/>

  <Timeline timeline={timeline} />
  <ProfileFooter />
</div>

let ProfileFooter = ({...props}) => <footer>
  <Future />
  <div className="tagline">help me i am not good with computer</div>
</footer>

let Links = ({links}) => <div className="links">
  {Object.entries(links).map(([name, link], i) => <a key={i} href={link}>{name}</a>)}
</div>

let Timeline = ({timeline}) => {
  const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
  timeline = timeline.map(({date, ...etc}) => {
    let [month, day, year] = date.split(" ");
    month = months.indexOf(month);

    if (month == -1) throw `invalid date ${date}`;

    date = new Date(year, month, day);

    return ({date, ...etc});
  });

  let years = new Map;

  timeline.forEach(({date, ...etc}) => {
    const year = date.getFullYear();
    if (!years.has(year)) years.set(year, new Map);
    const months = years.get(year);

    const month = date.getMonth();
    if (!months.has(month)) months.set(month, []);
    months.get(month).push({date, ...etc});
  });



 return <div className="timeline">
    {[...years.entries()].map(([year, months]) => <Year {...{year, months, key: year}}/> )}
</div>
}

let Year = ({year, months}) => <div className="year" data-year={year} style={{counterReset: `year ${year-1994}`}}>
  {[...months.entries()].map(([month, events]) => <Month {...{month, events, key: month}} />)}
</div>

let Month =({month, events}) => <div className="month" data-month={month} style={{counterReset: `month ${month}`}}>
  {events.map((event, i) => <Event {...{...event, key: i}}/>)}
</div>

let Event = ({date, tags, url, title, description}) => <div className="event">

  <a className="title" href={url}>{title}</a> <span className="description">{description}</span>
</div>

let VideoBackground = ({...props}) => <video poster="ash.jpg" autoPlay loop muted className="video-background">
  <source src="ash.mp4" type="video/mp4" />
</video>

let ProfileHeader = ({who: {name: names, handle}, links}) => <header>
  <SadHumans className="sad-icon"/>

  <div className="text">
    <div className="name">
      {names.map(name => name instanceof Array?name.map(n=>[...n][0]).join(""):name).join(" ")}
    </div>

    <div className="links">
      {Object.entries(links).map(([name, href]) => <a {...{key:name, href}}>{name}</a>)}
    </div>
  </div>
</header>

let SadHumans = ({...props}) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.78 7.81"><g style={{stroke:"var(--fgc)"}} transform="translate(-13.03 -62.53)"><path fill="none" strokeWidth=".26" d="M16.73 62.66l-3.47 6.02h17.32l-3.47-6.02z"/><circle cx="21.92" cy="65.47" r="1.61" fill="none" strokeWidth=".16"/><ellipse cx="21.92" cy="65.47" fill="none" strokeWidth=".23" rx="3.23" ry="1.58"/><path style={{fill:"var(--bgc)"}} strokeWidth=".16" d="M23.53 68.65a1.61 1.61 0 0 1-3.22 0c0-.9.72-1.2 1.61-1.62.9.42 1.61.73 1.61 1.62z"/><circle cx="21.92" cy="65.47" r=".54" strokeWidth=".08"/></g></svg>

let Future = ({...props}) => <svg className="future" {...props} xmlns="http://www.w3.org/2000/svg" width="446" height="348" viewBox="0 0 446 348" version="1"><path fill="none" d="M174 0L54 120l33 32L207 33 174 0zm98 0l-32 33 119 119 33-32L272 0zm-49 59L109 174l114 114 115-114L223 59zM33 141L0 174l33 33 33-33-33-33zm380 0l-32 33 32 33 33-33-33-33zM87 195l-33 33 120 120 33-33L87 195zm272 0L240 315l32 33 120-120-33-33z" vectorEffect="non-scaling-stroke"/></svg>

export default App;
