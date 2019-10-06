import React from 'react';
import style from './Home.module.css';


export const Home = ({data, className}) => {
  data.who.name=undefined; // just dont want it lol

  return <div className={[ style.home ].concat(className).join(" ")}>
    <Header {...bio}/>
  </div>
}

const Header = ({ who: {names, handle}}) =>
  <header className={style.Header}>
    <SadHumans className={style.logo} />
    <div className={style.handle}>{handle}</div>
    <div className={style.name}><Names {...{names}}/></div>
</header>

const Names = ({names}) => names.map(
  n => n instanceof Array?
    n.map(([firstLetter]) => firstLetter).join(""):
    nn).join(" ");