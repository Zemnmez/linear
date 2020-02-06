import * as t from '../timeline';
import * as React from 'react';


export const Timeline = () =>
    <t.Timeline {...t.Bio} />

export const Event = () =>
    <t.Event {...t.Bio.timeline[0]}/>

export default { title: 'timeline' }