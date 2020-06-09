import style from './style';
import Year from 'linear/component/bio/Year';
import * as component from 'linear/component';
import * as bio from 'linear/bio';
import React from 'react';
import * as dom from 'linear/dom';

export type Timeline = TimelineProps;
export interface TimelineProps {
    className?: string
    years: Year[]
}

export const Timeline:
    component.Component<(i: Timeline) => void>
=
    ({ years, className }) => <div {...{
        ...dom.classes(className, style.Timeline),
        children: years.sort((
            {year:a},
            {year:b}
        ) => b - a)
        .map((year, i) => <Year key={i} {...year}/>)
    }}>
    </div>
;

export default Timeline;