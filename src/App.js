import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3';
import D3 from 'reactive-d3';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {data: undefined, phase: App.getPhase()};
  }

  static get phases() {
    const morning = "day", night = "day";
    return ({morning, night});
  }

  static getPhase() {
    const now = new Date;

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

  componentDidMount() {
    this.phaseTimer = setInterval(() => this.setState({phase: this.getPhase()}), 60 * 1000 * 30);
    fetch("https://raw.githubusercontent.com/Zemnmez/bio/master/bio.json?"+Math.random())
      .then(r => r.json())
      .then(data => {
        data.timeline = data.timeline.map(({date, ...etc}) => {
          date = parseSimpleDate(date);

          return ({date, ...etc});
        });

        return data;
      })
      .then(data => this.setState({data}));

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

let Links = ({links}) => <div className="links">
  {Object.entries(links).map(([name, link], i) => <a key={i} href={link}>{name}</a>)}
</div>

const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
let parseSimpleDate = (date) => {
    let [month, day, year] = date.split(" ");
    month = months.indexOf(month);

    if (month == -1) throw `invalid date ${date}`;

    return new Date(year, month, day);
}

let Timeline = ({timeline}) => {
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


class Graph extends React.Component {
  join({main, width, height}) {
    const data = this.props.timeline;

    const svg = d3.select(main);
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const margin = ({top: 20, right: 30, bottom: 30, left: 60});

    let tags = [...data.reduce((a, c) => {
      c.tags.forEach(tag => a.set(
        tag,
        (a.get(tag) || 0) + 1
      ));
      return a;
    }, new Map())].sort(
      ([, count], [, count2]) => d3.ascending(count, count2)
    );

    let years = data.reduce((years, entry) => {
        years.set(
          entry.date.getFullYear(),
          (years.get(entry.date.getFullYear()) || []).concat(entry)
      );
      return years;
    }, new Map());

    /*let years = data.reduce((years, entry) => {
      entry.tags.forEach(tag =>
        years.set(
          entry.date.getFullYear(),
          (years.get(entry.date.getFullYear()) || []).concat({entry, tag})
        )
      );
      return years;
    }, new Map());*/

    years = [...years].map(([year, events]) => ({
      year,
      events,
    }))

    console.log({years});

    const scales = {}
    scales.incidence = d3.scaleLinear()
        .domain([0, d3.max(years, ({events}) =>
          events.reduce((a,c) => a + c.tags.length, 0))]);


    tags = tags.map(([tag, count]) => tag)

    let stack = d3.stack()
      .keys(tags)

    scales.tag = d3.scaleOrdinal()
        .unknown("#ccc")
        .domain(tags)
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), tags.length).reverse())


    let [minYear, maxYear] = d3.extent(years, y => y.year);
    minYear = new Date(minYear, 0);
    maxYear = new Date(maxYear+1, 0);

    scales.date = d3.scaleTime()
        .domain([minYear, maxYear]);

    const axes = {};

    [axes.x, axes.y] = [scales.date, scales.incidence];

    axes.x.range([margin.left, width - margin.right]);

    axes.y.range([height - margin.bottom, margin.top]);

    svg.select(".y.axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(axes.y));

    svg.select(".x.axis")
      .attr("transform", `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom(axes.x));

    let yearGroups = svg.select(".years").selectAll(".year").data(years);

    yearGroups.exit().remove();

    const inspect = (first, ...a) => {console.log(first, ...a); return first }

    yearGroups = yearGroups.enter().append("g")
      .classed("year", true)
      .merge(yearGroups)
      .attr("data-year", d => d.year);

    let tagBoxes = yearGroups.datum(({events}) => {
      let tags = [...events.reduce((group, {tags, ...etc}) => {
        tags.map(tag => group.set(tag, (group.get(tag) || []).concat({tag, ...etc})))
        return group;
      }, new Map())]
        .map(([tag, events]) => events)
        .sort((a,b) => d3.ascending(a.length, b.length))

      return inspect([].concat(...tags));
    }).selectAll("rect").data(d=>d);

   tagBoxes.exit().remove();

    //const firstEvent = years[0].events[0];

    //const yearWidth = scales.date(new Date(firstEvent.date.getFullYear()+1, 0))
    //  - scales.date(new Date(firstEvent.date.getFullYear() , 0));


    tagBoxes = tagBoxes.enter().append("rect")
      .merge(tagBoxes)
      // assign to the year
      .attr("x", ({date}) => scales.date(new Date(date.getFullYear(), 0)))
      //.attr("x", ({date}) => scales.date(date))
      .attr("y", ((_, i) => scales.incidence(i+1)))
      .attr("height", scales.incidence(0) - scales.incidence(1))
      .attr("data-tag", ({tag}) => tag)
      //width of a single year
      .attr("width", 20)
      .attr("fill", ({tag}) => scales.tag(tag));

  }




  render() {
    return <D3 className="graph" join={(...args) => this.join(...args)}>
      <svg>
        <g className="years" />
        <g className="x axis" />
        <g className="y axis" />
      </svg>
    </D3>
  }

}

export default App;
