import React from 'react';
import style from './Home.module.css';
import SadHumans from 'components/SadHumans';
import Timeline from 'components/Timeline';


export const Home = ({data: bio, className }) => {
  return <div className={[ style.home ].concat(className).join(" ")}>
    <Header {...bio}/>

    <Timeline {...{timeline: bio.timeline}}/>
  </div>
}

const Header = ({ who: {handle, name}}) =>
  <header className={style.Header}>
    <SadHumans className={style.logo} />
    <div className={style.handle}>{handle}</div>
    <div className={style.name}><Names {...{names: name}}/></div>
</header>

const Names = ({names}) => names.map(
  n => n instanceof Array?
    n.map(([firstLetter]) => firstLetter).join(""):
    n).join(" ");