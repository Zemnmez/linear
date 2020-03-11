import * as t from 'linear/page/Home/Timeline';
import * as React from 'react';
import { Knobs } from 'linear/component/defaults_knobs';
import { Bio } from 'linear/bio';
import { withKnobs, number, date, text } from "@storybook/addon-knobs";


export const Timeline = () =>
    <t.Timeline {...Bio} />

export const Event = () =>
    <t.Event {...{
        title: text("title", Bio.timeline[0].title),
        date: new Date(date("date", Bio.timeline[0].date)),
        description: text("description", Bio.timeline[0].description || ""),
        url: new URL(text("url", (Bio.timeline[0].url + "") || "")),
    }}/>

export default { title: __filename, decorators: [withKnobs] }