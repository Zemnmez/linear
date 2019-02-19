import React from 'react';
import style from './CV.module.css';
import { Name } from 'components/Profile';
import Moment from 'react-moment';
import Icon from 'components/SadHumans';

export default ({
  data: {
    who: {name: names, handle},
    bio,
    timeline,
    skills = []
  },
  className,
  focuses = "",
  limit = 6
}) => {

  let email, phone;

  return <div {...{
    className: [style.cv].concat(className).join(" ")
  }}>

    <Heading {...{names}} />

  </div>
}

const Heading = ({ className, names, email, phone }) => <div {...{
    className: [style.heading].concat(className).join(" ")
  }}>


    <a className={style.website} href="//zemn.me">zemn.me</a>
    <Email {...{email}} />
    <Phone {...{phone}}/>
    <Icon {...{className: style.headerIcon}} />
    <When {...{}} />
    <Name {...{className: style.name, names}}/>
</div>

const Email = ({ className, email = "foo@bar.com" }) => <div {...{
    className: [style.email].concat(className).join(" ")
  }}>

  {email}
</div>

const Phone = ({ className, phone = "+448394729340" }) => <div {...{
    className: [style.phone].concat(className).join(" ")
  }}>

  {phone}
</div>

const When = ({ className, format = "MMM YYYY", date = new Date() }) => <div {...{
    className: [style.date].concat(className).join(" ")
  }}>

  <Moment {...{format}}>{date}</Moment>
</div>
