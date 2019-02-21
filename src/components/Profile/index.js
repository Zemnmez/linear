import React from 'react';
import Timeline from '../Timeline';
import Graph from '../Graph';
import style from './Profile.module.css';
import SadHumans from '../SadHumans';
import Future from '../Future';
import Rule from '../Rule';

export const Profile = ({className, data: {who, timeline, links}}) => <div {...{
  className: [style.profile].concat(className).join(" ")
}}>
  <Header {...{who, links}}/>


  <Timeline timeline={timeline} />

  <Rule>⁂</Rule>

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
  <div className="tagline">
The sky before sunrise is soaked with light.<br/>
Rosy colour tints buildings, bridges, and the Seine. <br/>
I was here when she, with whom I walk, wasn&rsquo;t born yet <br />
And the cities on a distant plain stood intact <br/>
Before they rose in the air with the dust of sepulchral brick <br/>
And the people who lived there didn&rsquo;t know. <br/>
Only this moment at dawn is real to me.  <br/>
The bygone lives are like my own past life, uncertain. <br/>
I cast a spell on a city asking it to last. <br/>
<cite>Czesław Miłosz (translated from the Polish by Czesław Miłosz and Robert Hass)</cite>
</div>
</footer>





export default Profile;
