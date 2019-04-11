import React from 'react';
import D3 from 'reactive-d3';
import { lineRadial } from 'd3-shape';
import  style from './Load.module.css';
import { scaleLinear } from 'd3-scale';


const Hole = ({ progress, width, height, bgc, fgc, className }) => {
  return <div {...{
    className: style.fill,
  }}><svg {...{
    viewBox: `0 0 ${width} ${height}`,
    className: style.fill
  }}>

    <rect {...{
      width, height, fill: bgc, stroke: "none"
    }}/>

    <circle {...{
    cx: width/2,
    cy: height/2,
    r:
    Math.sqrt(
       (width/2) ** 2 + (height/2)**2
    ) * progress,
    fill: fgc
    }}/>
    </svg></div>
};

const Holes = ({ progress, width, height, cycleTime = 5000, className }) => {
  if (progress) return <Hole {...{
    progress, width, height
  }}/>

  const [t, setT] = React.useState();

  const doubleCycle = 2 * cycleTime;

  let frameRequest;
  const renderFrame = () => {
    setT((new Date() % doubleCycle) / doubleCycle);
    return frameRequest = window.requestAnimationFrame(renderFrame);
  }

  const cancelFrame = () => window.cancelAnimationFrame(frameRequest);

  React.useEffect(() => { renderFrame(); return cancelFrame });

  return <Hole {...{
    width, height,
    progress: (t %.5) /.5 ,
    bgc: t > .5? 'black': 'white',
    fgc: t > .5? 'white': 'black',
    className
  }}/>
}



class WH extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.join = this.join.bind(this);
  }

  join({ main, width, height}) { this.setState({main, width, height}) }

  render() {
    const { className, render } = this.props;
    const { main, width, height } = this.state;
    const { join } = this;

    return <D3 {...{
      className: [style.fill].concat(className).join(" "),
      join: join
    }}>
      {render({main, width, height})}
    </D3>
  }
}

export default ({className, ...etc}) => <WH {...{
  className,
  render: ({ width, height }) => <Holes {...{
    width, height, ...etc
  }}/>
}}/>
