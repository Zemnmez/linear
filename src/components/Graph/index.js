import React from 'react';
import D3 from 'reactive-d3';
import style from './Graph.module.css';
import * as d3 from 'd3';

export default class Graph extends React.PureComponent {
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
      couldn't get this to do literally anything...
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

    svg.select(`.${style.y}.${style.axis}`)
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(axes.y.scale));

    svg.select(`.${style.x}.${style.axis}`)
      .attr("transform", `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom(axes.x.scale));

    let events = svg.select(`.${style.boxes}`).selectAll("g")
      .data(data.map(({tags,date})=>tags.map(tag=>({tag,date}))));

    events.exit().remove();

    events = events.enter().append("g")
      .classed(style.event, true)
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
    const { props: { className } } = this;

    return <D3 {...{
      className: [style.graph].concat(className).join(" "),
      join: (...args) => this.join(...args)
    }}>

      <svg>
        <g className={style.boxes} />
        <g className={[style.x, style.axis].join(" ")} />
        <g className={[style.y, style.axis].join(" ")} />
      </svg>
    </D3>
  }

}
