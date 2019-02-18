import React from 'react';
import './App.css';
import * as d3 from 'd3';
import bio from './bio/bio.json';
import D3 from 'reactive-d3';
import Moment from 'react-moment';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import ashVideo from "./static/ash.mp4";
import ashPoster from "./static/ash.jpg";

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
    const className = "App";
    return (
        <Router>
          <Switch>
          <Route exact path="/" render={() => <Home {...{
            data: this.state.data,
            className
          }}/>}/>

          <Route exact path="/cv/" render={() => <Redirect to="/cv/work,security"/>}/>
          <Route exact path="/cv/:focuses" render={({ match: {params: {focuses}} }) =>
            <CV {...{data: this.state.data, focuses, className}} />
          }/>

          <Route render={() => <Redirect to="/"/>}/>
          </Switch>

        </Router>
    );
  }
}

const Home = ({data, className}) => <div className={["Home"].concat(className).join(" ")}>
        <VideoBackground />
        <header> <div className="innerText">{data.who.handle}</div> </header>
        <article> <Profile data={data} /> </article>
</div>

const CV = ({data: {who, bio,  timeline, skills = []}, className, focuses = "", limit = 6}) => {
  return <div className={["CV"].concat(className).join(" ")}>
      <ProfileHeader {...{
        who,
        links: { "zemn.me": "https://zemn.me"}
      }} />
      <p className="bio">{bio}</p>
      <p className="skills"> Skills: {skills.sort().join(" ")}</p>
      <Timeline {...{
        timeline,
        focuses: focuses.split(",").map(v=>v.trim()),
        minimumPriority: 6,
        limit
      }} />
      <Future />
  </div>
}

const Profile = ({data: {who, timeline, links}}) => <div className="profile">
  <ProfileHeader {...{who, links}}/>


  <Timeline timeline={timeline} />

  <div className="rule">
    <span>⁂</span>
  </div>

  <ProfileFooter timeline={timeline} />
</div>

const ProfileFooter = ({timeline, ...props}) => <footer>
  <Graph timeline={timeline} />
  <Future />
  <div className="tagline">
The sky before sunrise is soaked with light.<br/>
Rosy colour tints buildings, bridges, and the Seine. <br/>
I was here when she, with whom I walk, wasn&rsquo;t born yet <br />
And the cities on a distant plain stood intact <br/>
Before they rose in the air with the dust of sepulchral brick <br/>
And the people who lived there didn&rsquo;t know. <br/>
Only this moment at dawn is real to me.  <br/>
The bygone lives are like my own past life, uncertain. <br/>
I cast a spell on a city asking it to last. <br/>
<cite>Czesław Miłosz (translated from the Polish by Czesław Miłosz and Robert Hass)</cite>
</div>
</footer>

/*let Links = ({links}) => <div className="links">
  {Object.entries(links).map(([name, link], i) => <a key={i} href={link}>{name}</a>)}
</div> */

const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
let parseSimpleDate = (date) => {
    let [month, day, year] = date.split(" ");
    month = months.indexOf(month);

    if (month === -1) throw Error(`invalid date ${date}`);

    return new Date(year, month, day);
}

const Timeline = ({timeline, minimumPriority, focuses = [], limit = Infinity}) => {
  if (minimumPriority) timeline = timeline.filter(({ priority }) => priority >= minimumPriority);
  if (focuses.length) timeline = timeline.filter(({ tags }) => tags.some(a => focuses.some(b => a === b )));

  // find up to 'limit' events, filling with highest score
  if (limit != Infinity) timeline =
    [...timeline.sort(( {priority: a}, {priority: b} ) => b-a)
    // group by tag
    .reduce((tags, event) => {
      event.tags.forEach(tag => tags.set(tag, (tags.get(tag) || []).concat(event) )); // by reference
      console.log(tags);
      return tags;
    }, new Map())]

    .sort(( [a], [b] ) => {
      [a, b] = [a, b].map(v => {
        const o = focuses.indexOf(v);
        if (o === -1) return Infinity
        return o;
      });

      return a - b;
    })

    // produce single timeline getting roughly equal bits of each
    .reduce((acc, [tag, events]) => {
      if (acc.timeline.length >= limit) return acc;
      const want = acc.want || acc.equal;
      const segment = events.filter(({added}) => !added).slice(0, want);

      console.log({acc, tag, events, segment});

      segment.forEach(event => event.added = true);

      // if we don't get a full equal segment, we still want
      // to add up to the limit, so we give the next
      // tag our remaining count
      acc.want = acc.equal + (want - segment.length);
      acc.timeline = acc.timeline.concat(segment);

      return acc;
    }, {equal: Math.floor(limit / focuses.length), timeline: []}).timeline;

  if (timeline.length == 0) return <Redirect to="."/>

  timeline = timeline.sort(({date: a}, {date:b}) => b-a);

  let years = new Map();

  timeline.forEach(({date, ...etc}) => {
    const year = date.getFullYear();
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year);

    const month = date.getMonth();
    if (!months.has(month)) months.set(month, []);
    months.get(month).push({date, ...etc});
  });

 return <div className={
   focuses.concat("timeline").join(" ")
  }>
    {[...years.entries()].map(([year, months]) => <Year {...{year, months, key: year}}/> )}
</div>
}

const Year = ({year, months}) => <div className="year" data-year={year} style={{counterReset: `year ${year-1994}`}}>
  {[...months.entries()].map(([month, events]) => <Month {...{month, events, key: month}} />)}
</div>

const Month =({month, events}) => <div className="month" data-month={month} style={{counterReset: `month ${month}`}}>
  {events.map((event, i) => <Event {...{...event, key: i}}/>)}
</div>

const Event = ({date, tags, url, title, description, longDescription, duration}) => <div className={
  tags.concat("event").join(" ")
}>
  <a className="title" href={url}>
    {title.split(",").map((segment, i) => <span key={i}>{segment.trim()}</span>)}
  </a>{" "}
  {duration?<Duration {...{date, duration}}/>:""}
  {/*longDescription?<span className="description long">{longDescription}</span>: ""*/}
  <span className="description">{description}</span>
</div>

const aToOne = (str) => str.replace(/\ba\b/g, "1");
const Duration = ({date, duration}) => {
  if (duration === "ongoing") return <div className="duration">
    <Moment fromNow ago filter={aToOne}>{date}</Moment> (present)
  </div>
  return <div className="duration">{duration}</div>;
}

const VideoBackground = ({...props}) => <video poster={ashPoster} autoPlay muted playsInline loop className="video-background">
  <source src={ashVideo} type="video/mp4" />
</video>

const ProfileHeader = ({who: {name: names, handle}, links}) => <header className="profile">
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

const SadHumans = ({...props}) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.78 7.81"><g style={{stroke:"var(--fgc)"}} transform="translate(-13.03 -62.53)"><path fill="none" strokeWidth=".26" d="M16.73 62.66l-3.47 6.02h17.32l-3.47-6.02z"/><circle cx="21.92" cy="65.47" r="1.61" fill="none" strokeWidth=".16"/><ellipse cx="21.92" cy="65.47" fill="none" strokeWidth=".23" rx="3.23" ry="1.58"/><path style={{fill:"var(--bgc)"}} strokeWidth=".16" d="M23.53 68.65a1.61 1.61 0 0 1-3.22 0c0-.9.72-1.2 1.61-1.62.9.42 1.61.73 1.61 1.62z"/><circle style={{fill:"var(--fgc)"}} cx="21.92" cy="65.47" r=".54" strokeWidth=".08"/></g></svg>

const Future = ({...props}) => <svg className="future" {...props} xmlns="http://www.w3.org/2000/svg" width="446" height="348" viewBox="0 0 446 348" version="1"><path fill="none" d="M174 0L54 120l33 32L207 33 174 0zm98 0l-32 33 119 119 33-32L272 0zm-49 59L109 174l114 114 115-114L223 59zM33 141L0 174l33 33 33-33-33-33zm380 0l-32 33 32 33 33-33-33-33zM87 195l-33 33 120 120 33-33L87 195zm272 0L240 315l32 33 120-120-33-33z" vectorEffect="non-scaling-stroke"/></svg>


class Graph extends React.PureComponent {
  join({main, width, height}) {
    const data = this.props.timeline;

    const svg = d3.select(main);
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const margin = ({top: 20, right: 30, bottom: 30, left: 60});

    const tags = [...data.reduce((a, c) => {
          c.tags.forEach(tag => a.set(
            tag,
            (a.get(tag) || 0) + 1
          ));
          return a;
        }, new Map())].sort(
          ([, count], [, count2]) => d3.ascending(count, count2)
        ).map(([tag, count]) => tag);
    const axes = {}
    axes.tags = new class {
      constructor(){ this.scaleData = this.scaleData.bind(this); }

      scale = d3.scaleBand()
        .domain(tags)

      scaleData({tag}) { return this.scale(tag) }
    }();




    axes.date = new class {
      constructor(){
        this.scaleData = this.scaleData.bind(this)
      }

      scale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))

      /*
      couldn't get this to literally anything...
      scale = d3.scaleLog()
        .base(10000)
        .domain(d3.extent(data, d => d.date))
        //.domain([new Date() -10000, +new Date()])
      /*
      */


      scaleData({date}) { return this.scale(date) }
    }();

    [axes.x, axes.y] = [axes.date, axes.tags];

    axes.x.scale = axes.x.scale.range([margin.left, width - margin.right])

    axes.y.scale = axes.y.scale.range([height - margin.bottom, margin.top])


    /*let tagColors = d3.scaleOrdinal()
      .unknown("#ccc")
      .domain(tags)
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), tags.length).reverse());*/

    svg.select(".y.axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(axes.y.scale));

    svg.select(".x.axis")
      .attr("transform", `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom(axes.x.scale));

    let events = svg.select(".boxes").selectAll("g")
      .data(data.map(({tags,date})=>tags.map(tag=>({tag,date}))));

    events.exit().remove();

    events = events.enter().append("g")
      .classed("event", true)
      .merge(events);

    let boxes = events.selectAll("rect").data(d=>d);

    boxes.exit().remove();

    boxes = boxes.enter().append("rect")
      .merge(boxes)
      .attr("x", axes.x.scaleData)
      .attr("y", axes.y.scaleData)
      .attr("height", axes.y.scale.bandwidth())
      .attr("width", ({date}) => 1);
      //.attr("fill", ({tag}) => tagColors(tag));

  }




  render() {
    return <D3 className="graph" join={(...args) => this.join(...args)}>
      <svg>
        <g className="boxes" />
        <g className="x axis" />
        <g className="y axis" />
      </svg>
    </D3>
  }

}

export default App;
