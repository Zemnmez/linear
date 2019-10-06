import React from 'react';
import style from './Home.module.css';
import SadHumans from 'components/SadHumans';
import Timeline from 'components/Timeline';

export const Home = ({data: bio, className }) => {
  const { handle, name } = bio.who;
  return <div className={[ style.Home ].concat(className).join(" ")}>
    <SadHumans className={style.logo}/>
    <div className={style.handle}>{handle}</div>
    <div className={style.name}><Names {...{names: name}}/></div>

    <Timeline {...{
      timeline: bio.timeline,
      className: style.Timeline
    }}/>
  </div>
}

export const Names = ({names}) => names.map(
  n => n instanceof Array?
    n.map(([firstLetter]) => firstLetter).join(""):
    n).join(" ");