import style from 'linear/component/bio/style';
import Event from 'linear/component/bio/Event';
import * as simpledate from 'linear/time/simpledate';
import React from 'react';

export interface MonthProps {
    month: simpledate.Month
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

export default Month;