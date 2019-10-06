import React from 'react';
import SadHumans from 'components/SadHumans';
import Link from 'components/Link';
import style from './index.module.css'

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