import { Upgrade } from "../util"
import { KV } from '../higher';
import SimpleDate, { Parse as ParseSimpleDate } from './simpledate'


export interface BioJson {
    bio: string,
    birthdate: SimpleDate,
    employment: EmploymentJson[],
    skills: string[],
    links: Record<string, string>,
    timeline: JsonEvent[]
    who: Who
}

export type Bio = Upgrade<BioJson, {
    birthdate: Date,
    timeline: Event[],
    links: KV<string, URL>
}>

export interface Who {
    handle: string,
    name: string[]
}


export interface EmploymentJson {
    since: SimpleDate,
    title: string,
    where: string
}

export interface JsonEvent {
    date: SimpleDate,
    description?: string,
    tags?: string[],
    title: string,
    url?: string,
    priority?: number,
    duration?: string | "ongoing"
}

export type Event = Upgrade<JsonEvent,{
    date: Date,
    url?: URL
}>


export const Bio:
    (b: BioJson) => Bio
=
    ({birthdate, timeline, links, ...etc}) => ({
        birthdate: ParseSimpleDate(birthdate),
        timeline: Timeline(timeline),
        links: new Map(Object.entries(links).map(([k,v]) =>
            [k, new URL(v)])),
        ...etc
    })
;

const Timeline:
    (t: JsonEvent[]) => Event[]
=
    t => t.map(Event)
;

const Event:
    (e: JsonEvent) => Event
=
    ({ date, url, ...etc }) => ({
        date: ParseSimpleDate(date),
        url: url == undefined? url: new URL(url),
        ...etc
    })
;