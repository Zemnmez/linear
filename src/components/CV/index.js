import React from 'react';
import { Name } from 'components/Profile';
import Moment from 'react-moment';
import Icon from 'components/SadHumans';
import Rule from 'components/Rule';
import Future from 'components/Future';
import { Description } from 'components/Timeline';
import bcrypt_whitelist from 'knowitwhenyouseeit';
import style from './CV.module.css';

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
  limit = 6,
  phone = "",
  email = ""
}) => {

    let of_note = timeline.filter(({ priority }) => priority >=6)
        .filter(({ tags, description }) =>
          tags.some(tag => tag === "security") && !tags.some(tag => tag === "work")
        ).sort(({ priority: a}, {priority: b}) => b - a)

    const [of_note_1, of_note_2] = [of_note.slice(0,4), of_note.slice(4,8)]


  return <div {...{
    className: [style.cv].concat(className).join(" ")
  }}>

    <Header {...{
      email: bcrypt_whitelist("$2a$11$4ad28pmQZw7z1Mi.DheOBeCgo2qa323.yzcxWUNTA6Y1Q4GfzqiVC")(email),
      phone: bcrypt_whitelist("$2a$11$SQtYc3STHgrijkuoDiO2O.X020hozBXl06lam/DIEdyMiGUKoPcWm")(phone),
      names
    }} />


    <Rule className={style.experienceTitle}>selected experience</Rule>

    <Experience {...{
      events: timeline.filter(({ tags }) => tags.some(tag => tag === "work"))
        .sort(({ date: a }, { date: b }) => b - a).slice(0, 4)
    }} />

    <Rule className={style.worksTitle}>of note</Rule>

    <Skills {...{
      skills: skills.sort((a,b) => a > b? 1 : -1).slice(0, 12).map(skill => ({title: skill}))
    }} />

    <Rule className={style.skillsTitle}>skills</Rule>

    <Skills className={style.works} {...{
      skills: of_note_1
    }} />

    <Skills className={style.works2} {...{
      skills: of_note_2
    }} />


    <Future className={style.future}/>

  </div>
}

const Skills = ({ skills, className }) => <div {...{
    className: [style.skills].concat(className).join(" ")
  }}>

  {skills.map((skill, i) => <Skill {...{...skill, key: skill.title}} />)}
</div>

const Skill = ({ title, description, className }) => [
  <div className={style.title}>{title}</div>,
  <div className={style.description}>{description}</div>
]

const t = { milliseconds: 1 };
t.seconds = t.milliseconds * 1000;
t.minutes = t.seconds * 60;
t.hours = t.minutes * 60;
t.days = t.hours * 24;
t.weeks = t.days * 7;
t.years = t.days * 365;

let parseDuration = (duration) => {
  const [n, unit] = duration.split(" ");
  return (+n) * (t[unit] || hurl(`unknown unit ${unit}`));
}

/*const roundUpToNearestYear = (date) =>
  new Date(date.getFullYear(),12); */

const roundDownToNearestYear = (date) =>
  new Date(date.getFullYear()-1,12)

const Experience = ({ events, className }) => <div {...{
    className: [style.experience].concat(className).join(" ")
  }}>

  {events.map((event, i) => <Work key={i} {...event} />)}
</div>

const aToOne = (str) => str.replace(/\ba\b/g, "1");
const Work = ({ date, description, duration, title, points, className }) => {

  // rough
  const [position, employer] = title.split(",").map(v => v.trim());

  duration = duration === "ongoing"? undefined: parseDuration(duration);

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
      <div className={style.duration}><Moment filter={aToOne} ago to={roundDownToNearestYear(new Date( (+date) + duration))}>{date}</Moment></div>:
      <div className={style.duration}><Moment filter={aToOne} ago toNow>{roundDownToNearestYear(date)}</Moment></div>
  }

  <Description {...{
    className: style.content,
    description
  }} />

  </div>
}


const Header = ({ email, phone, names, className }) => <div {...{
    className: [style.header].concat(className).join(" ")
  }}>

    <a className={style.website} href="//zemn.me">zemn.me</a>
    <Email {...{email}} />
    <Phone {...{phone}}/>
    <Icon {...{className: style.headerIcon}} />
    <When {...{format: "MMM YYYY"}} />
    <Name {...{className: style.name, names}}/>
</div>




const Email = ({ className, email }) => <div {...{
    className: [style.email].concat(className).join(" ")
  }}>

  {email}
</div>

const Phone = ({ className, phone }) => <div {...{
    className: [style.phone].concat(className).join(" ")
  }}>

  {phone}
</div>

const When = ({ className, format = "YYYY", date = new Date() }) => <div {...{
    className: [style.date].concat(className).join(" ")
  }}>

  <Moment {...{format}}>{date}</Moment>
</div>
