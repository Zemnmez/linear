import * as timeline from 'linear/timeline';
import * as React from 'react';
import { Bio, Event } from 'linear/timeline/timeline';

export type Timeline = {
    /** tags to filter for */
    focuses: ReadonlyArray<string>,
    bio: Bio
}

export const CV:
    React.FC<Bio>
=
    b => <Timeline {...{bio}} />
;

export const Timeline:
    React.FC<Timeline>
=
    ({ bio, focuses }) => {
        const timeline = bio.timeline.filter(
            event => event.tags?.some(t => focuses.some(t2 => t2 == t ))
        ).sort(({priority: a = 0}, {priority: b = 0}) => a-b);
    }
;
