import React from 'react';
import './App.css';
import * as d3 from 'd3';
import bio from './bio.json';
import D3 from 'reactive-d3';

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {data: App.parseDates(bio), phase: App.getPhase()};
  }

  static get phases() {
    const morning = "day", night = "day";
    return ({morning, night});
  }

  static getPhase() {
    const now = new Date();

    let setTime = (date, [Hours, Minutes]) => {
      Object.entries({Hours, Minutes}).forEach(([k, v]) => date["set"+k](v));
      return date;
    }

    const morning = setTime(new Date(+now), [6, 0]);
    const night = setTime(new Date(+now), [19, 0]);

    let phase = now > morning? this.phases.morning: this.phases.night;

    phase = now > night? this.phases.night: phase;

    return phase;
  }

  static parseDates(data) {
    data.timeline = data.timeline.map(({date, ...etc}) => {
      date = parseSimpleDate(date);

      return ({date, ...etc});
    });

    return data;
  }

  componentDidMount() {
    this.phaseTimer = setInterval(() => this.setState({phase: this.getPhase()}), 60 * 1000 * 30);
    fetch("https://raw.githubusercontent.com/Zemnmez/bio/master/bio.json?"+Math.random())
      .then(r => r.json(), (error) => {
        console.log(error);
        return bio;
      })
      .then(data => App.parseDates(data))
      .then(data => this.setState({data}))

  }

  componentWillUnmount() {
    this.phaseTimer && clearInterval(this.phaseTimer);
  }


  render() {
    if (!this.state.data) return "";
    return (
      <div className={["App", this.state.phase].join(" ")}>
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

  <div className="rule">
    <span>⁂</span>
  </div>

  <ProfileFooter timeline={timeline} />
</div>

let ProfileFooter = ({timeline, ...props}) => <footer>
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

let Timeline = ({timeline}) => {
  let years = new Map();

  timeline.forEach(({date, ...etc}) => {
    const year = date.getFullYear();
    if (!years.has(year)) years.set(year, new Map());
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

let VideoBackground = ({...props}) => <video poster="ash.jpg" autoPlay muted playsInline loop className="video-background">
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

let SadHumans = ({...props}) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.78 7.81"><g style={{stroke:"var(--fgc)"}} transform="translate(-13.03 -62.53)"><path fill="none" strokeWidth=".26" d="M16.73 62.66l-3.47 6.02h17.32l-3.47-6.02z"/><circle cx="21.92" cy="65.47" r="1.61" fill="none" strokeWidth=".16"/><ellipse cx="21.92" cy="65.47" fill="none" strokeWidth=".23" rx="3.23" ry="1.58"/><path style={{fill:"var(--bgc)"}} strokeWidth=".16" d="M23.53 68.65a1.61 1.61 0 0 1-3.22 0c0-.9.72-1.2 1.61-1.62.9.42 1.61.73 1.61 1.62z"/><circle style={{fill:"var(--fgc)"}} cx="21.92" cy="65.47" r=".54" strokeWidth=".08"/></g></svg>

let Future = ({...props}) => <svg className="future" {...props} xmlns="http://www.w3.org/2000/svg" width="446" height="348" viewBox="0 0 446 348" version="1"><path fill="none" d="M174 0L54 120l33 32L207 33 174 0zm98 0l-32 33 119 119 33-32L272 0zm-49 59L109 174l114 114 115-114L223 59zM33 141L0 174l33 33 33-33-33-33zm380 0l-32 33 32 33 33-33-33-33zM87 195l-33 33 120 120 33-33L87 195zm272 0L240 315l32 33 120-120-33-33z" vectorEffect="non-scaling-stroke"/></svg>


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
