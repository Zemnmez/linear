import React from 'react';
import moment from 'moment';
import style from './CV.module.css';
import { Name } from 'components/Profile';
import Moment from 'react-moment';
import Icon from 'components/SadHumans';
import { Description } from 'components/Timeline';

const hurl = (message) => { throw new Error(message) }

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

    <Header {...{email, phone, names }} />
    <Experience {...{
      events: timeline.filter(({ tags }) => tags.some(tag => tag == "work"))
        .sort(({ date: a }, { date: b }) => b - a)
    }}/>


    <Skills {...{
      skills
    }}/>


    {/*
    <Skills {...{
      skills: timeline.filter(({ tags }) => tags.some(tag => skills.some(skill => skill == tag)))
        .sort(({ priority: a }, { priority: b }) => a-b).slice(0, 10);
    }}/> */}


  </div>
}

const Skills = ({ skills, className }) => <div {...{
    className: [style.skills].concat(className).join(" ")
  }}>

  {skills.map((skill, i) => <Skill key={i} {...{skill}} />)}
</div>

const Skill = ({ skill, className }) => <div {...{
    className: [style.skill].concat(className).join(" ")
  }}>

  {skill}
</div>



let parseDuration;
{
  const t = { milliseconds: 1 };
  t.seconds = t.milliseconds * 1000;
  t.minutes = t.seconds * 60;
  t.hours = t.minutes * 60;
  t.days = t.hours * 24;
  t.weeks = t.days * 7;
  t.years = t.days * 365;

  parseDuration = (duration) => {
    const [n, unit] = duration.split(" ");
    return (+n) * (t[unit] || hurl(`unknown unit ${unit}`));
  }
}

const Experience = ({ events, className }) => <div {...{
    className: [style.experience].concat(className).join(" ")
  }}>

  {events.map((event, i) => <Work key={i} {...event} />)}
</div>

const Work = ({ date, description, duration, title, points, className }) => {

  // rough
  const [position, employer] = title.split(",").map(v => v.trim());

  duration = duration == "ongoing"? undefined: parseDuration(duration);

  return <div {...{
      className: [style.work].concat(className).join(" ")
    }}>

    <div className={style.employer}>{employer}</div>
    <div className={style.position}>{position}</div>
    <When {...{date: date, className: style.start}} />
    {duration?
      <When {...{date: new Date( (+date) + duration), className: style.end}}/>:
      <div className={style.end}>Present</div>
    }

  {duration?
      <div className={style.duration}><Moment ago to={new Date( (+date) + duration)}>{date}</Moment></div>:
      <div className={style.duration}><Moment ago toNow>{date}</Moment></div>
  }

    <Description {...{
      className: style.content,
      description
    }}/>
  </div>
}


const Header = ({ email, phone, names, className }) => <div {...{
    className: [style.header].concat(className).join(" ")
  }}>

    <a className={style.website} href="//zemn.me">zemn.me</a>
    <Email {...{email}} />
    <Phone {...{phone}}/>
    <Icon {...{className: style.headerIcon}} />
    <When />
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
