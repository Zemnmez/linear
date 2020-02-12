import { Bio, Event as BioEvent } from './timeline';
import { L, I } from 'ts-toolbelt';
import { Map } from 'immutable';
import { Month as MonthIndex } from 'timeline/simpledate';
import * as React from 'react';
import { Link, isLinkable } from 'Link';
import { must } from 'higher/guard';
import style from './style.module.css'
import { KV } from 'higher';


export type Tags = Pick<Event, 'tags'>;
export type TagsProps = Tags;
export const Tags:
    React.FC<Tags>
=
    ({ tags }) => <ul {...{
        className: style.Tags,
        children: tags?.map(t => <li>{t}</li>)
    }}/>
;

export type Description = Pick<Event, 'description'>;
export type DescriptionProps = Description;
export const Description:
    React.FC<Description>
=
    ({ description }) => <div {...{
        className: style.Description,
        children: description
    }}/>
;

export type Title = Pick<Event, 'title' | 'url'>;
export type TitleProps = Title;
export const Title:
    React.FC<Title>
=
    ({ title, url }) => <header {...{
        className: style.Title,
    }}>
        <Link {...{
            url: url?must(isLinkable)(url):url
        }}>
            {title}
        </Link>
    </header>
;

export type EventProps = Event;
export type Event = BioEvent;
export const Event:
    React.FC<Event>
=
    ({date, description, tags, title, url, priority,
        duration}) => <div {...{
        className: style.Event,
        "data-tags": tags?.join(","),
        children: [
            ...description? [<Description {...{description}}/>]: [],
            ...tags? [<Tags {...{tags}}/>]: [],
            ...title? [<Title {...{title}}/>]: []
        ]
    }}/>
;

export interface MonthProps {
    month: MonthIndex
    events: Event[]
}

export type Month = MonthProps;
export const Month:
    React.FC<Month>
=
    ({ month, events }) => <div {...{
        className: style.Month,
        "data-month": month,
        children: events.map((e, i) => <Event {...{
            key: i,
            ...e
        }}/>)
    }}/>
;


export interface YearProps {
    year: number
    months: MonthProps[]
}

export type Year = YearProps
export const Year:
    React.FC<Year>
=
    ({ year, months }) => <div {...{
        'data-year': year,
        className: style.Year,
        children: months.map((m, i) => <Month key={i} {...m}/>)
    }}/>;
;


export interface OrderedTimeline {
    years: Year[]
}

export type Timeline = TimelineProps
export type TimelineProps = OrderedTimeline | Bio
export const Timeline:
    React.FC<Timeline>
=
    (o) => {
        const {years} = "years" in o? o: CollateBio(o);

        return <div {...{
            children: years.map((y, i) => <Year key={i} {...y}/>), className: style.Timeline,
        }}/>
    }
;

const CollateBio:
    (t: Bio) => OrderedTimeline
=
    t => {
        const m = DupeMap(...t.timeline.map<[number,Event]>(e =>
        [e.date.getFullYear(), e]));

        const yearMonths = Map([...m].map(([year, events]) => [
            year,
            DupeMap(
                ...events.map<[number,Event]>(e => [e.date.getMonth(), e])
            )
        ]));

        const years = [...yearMonths].map(
            ([year, months]) => ({
                year,
                months: [...months].map(
                    ([month, events]) => ({
                        month,
                        events
                    })
                )
            })
        );

        return { years };
    }
;

const DupeMap:
    <K,V>(...v: [K,V][]) => Map<K,V[]>
=
    (...v) => {
        let o = Map<typeof v[0][0], typeof v[0][1][]>();
        for (const [K, V] of v)
            o = o.set(
                K,
                [
                    ...(o.get(K) ?? []),
                    V
                ]
            );
        return o;
    }
;