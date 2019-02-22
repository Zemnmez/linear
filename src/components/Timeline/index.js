import style from './Timeline.module.css';
import Moment from 'react-moment';
import React from 'react';


export default ({ className, timeline, minimumPriority, focuses = [], limit = Infinity}) => {
  if (minimumPriority) timeline = timeline.filter(({ priority }) => priority >= minimumPriority);
  if (focuses.length) timeline = timeline.filter(({ tags }) => tags.some(a => focuses.some(b => a === b )));

  // find up to 'limit' events, filling with highest score
  if (limit !== Infinity) timeline =
    [...timeline.sort(( {priority: a}, {priority: b} ) => b-a)
    // group by tag
    .reduce((tags, event) => {
      event.tags.forEach(tag => tags.set(tag, (tags.get(tag) || []).concat(event) )); // by reference
      console.log(tags);
      return tags;
    }, new Map())]

    .sort(( [a], [b] ) => {
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

  timeline = timeline.sort(({date: a}, {date:b}) => b-a);

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
   className: [style.timeline].concat(focuses).concat(className).join(" ")
  }}>
    {[...years.entries()].map(([year, months]) => <Year {...{year, months, key: year}}/> )}
</div>
}


const Year = ({year, months, className }) => <div {...{
  className: [style.year].concat(className).join(" "),
  style: {counterReset: `year ${year-1994}`},
  "data-year": year
}}>
  {[...months.entries()].map(([month, events]) => <Month {...{month, events, key: month}} />)}
</div>

const Month =({ month, events, className }) => <div {...{
  className: [style.month].concat(className).join(" "),
  "data-month": month,
  style: {counterReset: `month ${month}`}
}}>
  {events.map((event, i) => <Event {...{...event, key: i}}/>)}
</div>

const Event = ({date, tags, url, title, description, longDescription, duration, className }) => <div {...{
    className: [style.event].concat(className, tags).join(" ")
  }}>
  <a className={style.title} href={url}>
    {title.split(",").map((segment, i) => <span key={i}>{segment.trim()}</span>)}
  </a>{" "}
  {duration?<Duration {...{date, duration}}/>:""}
  <Description {...{description}} />
</div>

export const Description = ({ description = "", className }) => {

  return <span {...{
    className: [style.description].concat(className).join(" ")
  }}>

    {description.split("\n").map((para, i) => <p key={i}>{para}</p>)}
  </span>
}

const aToOne = (str) => str.replace(/\ba\b/g, "1");
const Duration = ({date, duration, className}) => {
  if (duration === "ongoing") return <div {...{
    className: [style.duration].concat(className).join(" ")
  }}>
    <Moment fromNow ago filter={aToOne}>{date}</Moment> (present)
  </div>
  return <div {...{
    className: [style.duration].concat(className).join(" ")
  }}>{duration}</div>;
}
