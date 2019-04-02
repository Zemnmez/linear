import React from 'react';
import style from './Art.module.css';
import D3 from 'reactive-d3';
import { lineRadial } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { List } from 'immutable';
import log from '@zemnmez/macros/log.macro';

export default class Apr1st2019 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { now: new Date() }
  }

  componentDidMount() {
    this.shouldStop = false;
    window.requestAnimationFrame(() => {
      this.setState(() => ({ now: new Date() }))
      !this.shouldStop && this.componentDidMount()
    })
  }

  componentWillUnmount() {
    this.shouldStop = true;
  }


  render() {
    const { ...etc } = this.props;
    return <Render {...{
      time: this.state.now,
      ...etc
    }}/>
  }
}

class Render extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { }

    this.join = this.join.bind(this);
    log({className: this.props.className });
  }

  join({ main, width, height }) { this.setState({ main, width, height }); }

  render() {
    const { width, height } = this.state;
    const { time } = this.props;
    const range = new List([width, height]);
    return <D3 {...{
      className: [this.props.className,
      style.art, style.Apr2nd2019 ],
      join: this.join
    }}>
      <svg {...{
          viewBox: `0 0 ${width} ${height}`
      }}>
        <Petal {...{
          range,
          value: time
        }}/>
      </svg>
    </D3>
  }
}

const millisecond = 1;
const second = 1000 * millisecond;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

class Petal extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { range, domain, value } = this.props;
    const k1 = 2*Math.PI * (((+value) % hour) / hour )
    const k2 = 2*Math.PI * (((+value) % day) / day )
    const data = [...Array(Math.floor(2*Math.PI/.1))]
      .map((_, t) => [t, Math.sin(k1*2 * t) * Math.cos(k2*2*t)]);

    const [ width, height ] = range;

    const radius = Math.min(width, height) / 2 - 30;

    const scale = scaleLinear()
      .domain([0, .5])
      .range([0, radius]);

    const line = lineRadial()
      .radius(([t, ft]) => scale(ft))
      .angle(([t, ft]) => -t + Math.PI / 2);

    return <g {...{
      transform: `translate(${[...range]
        .map(v => v/2)})`
    }}>
      <path {...{
        d: line(data)
      }}/>
    </g>
  }
}
