import React from 'react';
import PropTypes from 'prop-types';
import log from '@zemnmez/macros/log.macro';
import D3 from 'reactive-d3';
import style from './Graph.module.css';

import * as selection from 'd3-selection';
import * as scale from 'd3-scale';
import * as axis from 'd3-axis';
import * as array from 'd3-array';

const d3 = {...selection, ...scale, ...axis, ...array};

class GraphRenderer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state={ width: 0, height: 0};
  }

  join({ width, height}) { this.setState({ width, height}) }

  render() {
    const { props: { className, data, events, tags, margins = [
      20, 30, 30, 60
    ]} } = this;
    const { width, height } = this.state;
    const margin = (([top, right, bottom, left]) => ({
      top, right, bottom, left
    }))(margins);

    const tagsScale = d3.scaleBand()
      .domain(tags);

    const dateScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date));

    let [xScale, yScale] = [dateScale, tagsScale];

    const rightOffset = width - margin.right;
    const topOffset = height - margin.bottom;

    [xScale, yScale] = [
      xScale.range([margin.left, width - margin.right]),
      yScale.range([height - margin.bottom, margin.top])
    ];

    /*
    const xLogScale = d3.scalePow().exponent(4)
      .domain(xScale.range())
      .range(xScale.range());
    */
    const xLogScale = x => x;


    return <D3 {...{
      className: [ style.graph ].concat(className).join(" "),
      join: (...args) => this.join(...args)
    }}>

      <svg {...{
        viewBox: `0 0 ${width} ${height}`
      }}>
        <g className={style.boxes}>
          {events.map(tags => tags.map(({date, tag}, i) => <Entry {...{
            className: style.event,
            x: xLogScale(xScale(date)),
            y: yScale(tag),
            date, tag,
            height: yScale.bandwidth(),
            width: 1,
            key: i
          }}/>))}
        </g>

        <Axis {...{
          transform: `translate(0,${height-margin.bottom})`,
          generator: d3.axisBottom(xScale)
        }}/>

        <Axis {...{
          transform: `translate(${margin.left},0)`,
          generator: d3.axisLeft(yScale)
        }}/>
      </svg>
    </D3>
  }
}

const Entry = ({ x, y, height, width, tag }) => <g {...{
  className: style.event
}}>
  <rect {...{
    x, y, height, width
  }}/>
</g>

Entry.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

class Axis extends React.Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  componentDidMount() { this.componentDidUpdate() }

  componentDidUpdate() {
    const { generator } = this.props;
    d3.select(this.myRef.current).call(generator);
  }

  render() {
    const { transform } = this.props;
    const { myRef } = this;
    return <g {...{
      transform,
      ref: myRef
    }}/>
  }
}

export default class Graph extends React.PureComponent {
  render() {
    const { timeline: data, ...etc } = this.props;
    return <GraphRenderer {...{
      tags: [ ...data.reduce((a, c) => {
        c.tags.forEach(tag => a.set(
          tag,
          (a.get(tag) || 0) + 1
        ));
        return a;
      }, new Map()) ].sort(
        ([, count], [, count2]) => d3.ascending(count, count2)
      ).map(([tag, count]) => tag),
      events: data.map(({tags, date})=>tags.map(tag=>({tag, date}))),
      data,
      ...etc
    }}/>
  }
}
