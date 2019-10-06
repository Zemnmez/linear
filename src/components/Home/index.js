import React from 'react';
import style from './Home.module.css';
import SadHumans from 'components/SadHumans';
import Timeline from 'components/Timeline';
import Link from 'components/Link'
import { classes } from 'lib/classes'

export const Home = ({data: bio, className }) => {
  const { handle, name } = bio.who;
  const { links } = bio;
  return <div className={[ style.Home ].concat(className).join(" ")}>
    <SadHumans className={style.logo}/>
    <div className={style.handle}>{handle}</div>
    <div className={style.name}><Names {...{names: name}}/></div>

    <Links {...{
      links,
    }}/>

    <Timeline {...{
      timeline: bio.timeline,
      className: style.Timeline
    }}/>
  </div>
}

export const Links = ({ links, className }) => <div {...{
  className: classes(className, style.links)
}}>
  {Object.entries(links).map(([name, href]) =>
    <Link {...{href}}>{name}</Link>)}
</div>

export const Names = ({names}) => names.map(
  n => n instanceof Array?
    n.map(([firstLetter]) => firstLetter).join(""):
    n).join(" ");