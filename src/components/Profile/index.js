import React from 'react';
import Timeline from 'components/Timeline';
import Graph from 'components/Graph';
import SadHumans from 'components/SadHumans';
import Link from 'components/Link';
import Future from 'components/Future';
import Rule from 'components/Rule';
import style from './Profile.module.css';

export const Profile = ({className, data: {who, timeline, links}}) => <div {...{
  className: [ style.profile ].concat(className).join(" ")
}}>
  <Header {...{who, links}}/>


  <Timeline timeline={timeline} />

  <Rule className={style.rule}>⁂</Rule>

  <Footer timeline={timeline} />

</div>



export const Header = ({who: {name: names, handle}, links, className}) => <header {...{
  className: [ style.header ].concat(className).join(" ")
}}>
  <SadHumans className={style.eye} />

  <div className={style.text}>
    {names&&<Name {...{names}} />}

    <div className={style.links}>
      {Object.entries(links).map(([name, href]) => <Link notinline {...{key: name, to: href }}>{name}</Link>)}
    </div>
  </div>
</header>

export const Name = ({ names, className }) => <div {...{
  className: [ style.name ].concat(className).join(" ")
}}>
  {names.map(name => name instanceof Array? name.map(n => [ ...n ][0]).join(""): name).join(" ")}
</div>



export const Footer = ({timeline, className}) => <footer {...{
  className: [ style.footer ].concat(className).join(" ")
}}>

  <Graph timeline={timeline} className={style.graph} />
  <Future className={style.future} />

  <Tagline />
</footer>


const Tagline = ({ className, ...etc }) => <div {...{
  className: [ style.tagline ].concat(className).join(" ")
}}>

  <div {...{
    className: style.copyright
  }}>© thomas nj shadwell {new Date().getFullYear()}</div>
</div>



export default Profile;

