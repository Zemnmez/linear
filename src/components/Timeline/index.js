import style from './Timeline.module.css';
import { classes } from 'lib/classes';
import Moment from 'react-moment';
import React from 'react';
import Link from 'components/Link';


export default ({
  className, timeline, minimumPriority, focuses = [], limit = Infinity
}) => {
  if (minimumPriority) timeline = timeline.filter(({ priority }) => priority >= minimumPriority);
  if (focuses.length) timeline = timeline.filter(({ tags }) => tags.some(a => focuses.some(b => a === b )));

  // find up to 'limit' events, filling with highest score
  if (limit !== Infinity) timeline =
    [ ...timeline.sort(( {priority: a}, {priority: b} ) => b-a)
    // group by tag
      .reduce((tags, event) => {
        event.tags.forEach(tag => tags.set(tag, (tags.get(tag) || []).concat(event) )); // by reference
        console.log(tags);
        return tags;
      }, new Map()) ]

      .sort(( [ a ], [ b ] ) => {
        [a, b] = [a, b].map(v => {
          const o = focuses.indexOf(v);
          if (o === -1) return Infinity
          return o;
        });

        return a - b;
      })

    // produce single timeline getting roughly equal bits of each
      .reduce((acc, [tag, events]) => {
        if (acc.timeline.length >= limit) return acc;
        const want = acc.want || acc.equal;
        const segment = events.filter(({added}) => !added).slice(0, want);

        console.log({acc, tag, events, segment});

        segment.forEach(event => event.added = true);

        // if we don't get a full equal segment, we still want
        // to add up to the limit, so we give the next
        // tag our remaining count
        acc.want = acc.equal + (want - segment.length);
        acc.timeline = acc.timeline.concat(segment);

        return acc;
      }, {equal: Math.floor(limit / focuses.length), timeline: []}).timeline;

  timeline = timeline.sort(({date: a}, {date: b}) => b-a);

  let years = new Map();

  timeline.forEach(({date, ...etc}) => {
    const year = date.getFullYear();
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year);

    const month = date.getMonth();
    if (!months.has(month)) months.set(month, []);
    months.get(month).push({date, ...etc});
  });

  return <div {...{
    className: classes(style.timeline, className, ...focuses) 
  }}>
    {[ ...years.entries() ].map(([year, months]) => <Year {...{year, months, key: year}}/> )}
  </div>
}


const Year = ({ year, months, className }) => <>
  <div {...{
    className: classes(className, style.year),
    style: {
      "--timeline-year": year,
    },
  }}>

    <div {...{
      className: style.decimalYear,
    }}>
      {year}
    </div>

    <div {...{
      className: style.ageIndicator,
    }}/>

    <Group>
    {[ ...months.entries() ].reverse().map(([month, events]) => <Month {...{month, events, key: month}} />)}
    </Group>
  </div>
</>

const Month =({ month, events, className }) => <div {...{
  className: classes(style.month, className),
  style: {counterReset: `month ${month}`}
}}>


  <div {...{
    className: style.monthIndicator,
    "data-month": month,
  }}/>

  {events.map((event, i) => <Event {...{...event, key: i}}/>)}
</div>

export const Event = ({date, tags, url, title, description, longDescription, duration, className }) => <div {...{
  className: classes(style.event, className, ...tags)
}}>
  <Link className={style.title} to={url}>
    {title}
  </Link>{" "}
  {duration?<Duration {...{date, duration}}/>:""}
  <Description {...{description}} />
</div>

export const Description = ({ description = "", className }) => {

  return <span {...{
    className: classes(className, style.description)
  }}>

    {description.split("\n").map((para, i) => <p key={i}>{para}</p>)}
  </span>
}

const aToOne = str => str.replace(/\ba\b/g, "1");
const Duration = ({date, duration, className}) => {
  if (duration === "ongoing") return <div {...{
    className: classes(style.duration, className)
  }}>
    <Moment fromNow ago filter={aToOne}>{date}</Moment> (present)
  </div>
  return <div {...{
    className: [ style.duration ].concat(className).join(" ")
  }}>{duration}</div>;
}

const Group = ({ children }) => <div className={style.group}>
  {children}
</div>
