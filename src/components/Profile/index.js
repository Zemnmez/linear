import React from 'react';
import Timeline from '../Timeline';
import Graph from '../Graph';
import SadHumans from '../SadHumans';
import Future from '../Future';
import Rule from '../Rule';
import style from './Profile.module.css';

export const Profile = ({className, data: {who, timeline, links}}) => <div {...{
  className: [style.profile].concat(className).join(" ")
}}>
  <Header {...{who, links}}/>


  <Timeline timeline={timeline} />

  <Rule className={style.rule}>⁂</Rule>

  <Footer timeline={timeline} />
</div>

export const Header = ({who: {name: names, handle}, links, className}) => <header {...{
  className: [style.header].concat(className).join(" ")
}}>
  <SadHumans className={style.eye} />

  <div className={style.text}>
  {names&&<Name {...{names}} />}

    <div className={style.links}>
      {Object.entries(links).map(([name, href]) => <a {...{key:name, href}}>{name}</a>)}
    </div>
  </div>
</header>

export const Name = ({ names, className }) => <div {...{
    className: [style.name].concat(className).join(" ")
  }}>
  {names.map(name => name instanceof Array? name.map(n => [...n][0]).join(""): name).join(" ")}
</div>



export const Footer = ({timeline, className}) => <footer {...{
    className: [style.footer].concat(className).join(" ")
  }}>

  <Graph timeline={timeline} className={style.graph} />
  <Future className={style.future} />
</footer>





export default Profile;
