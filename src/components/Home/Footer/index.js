import Graph from 'components/Graph';
import Future from 'components/Future';

export const Footer = ({timeline, className}) => <footer {...{
  className: [ style.footer ].concat(className).join(" ")
}}>

  <Graph timeline={timeline} className={style.graph} />
  <Future className={style.future} />

</footer>