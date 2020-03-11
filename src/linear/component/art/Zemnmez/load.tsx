import { scaled as RotPath, Config } from './zemnmez_rot';
import log from '@zemnmez/macros/log.macro';
import assert from '@zemnmez/macros/assert.macro';
import React from 'react';
import { classes } from 'linear/dom/classes';
import { PathSVG } from '../svg';
import { assertInvalidNever } from 'linear/util';

export interface LoadProps {
    className?: string,
    switchTime?: number
}

const frames: Config[] = [
    { smallSquare: 1, bigSquare: 5, gap: 1},
    { smallSquare: 5, bigSquare: 1, gap: 1 },
    { smallSquare: 1, bigSquare: 1, gap: 5}
];

export const Load:
    React.FC<LoadProps>
=
    ({ className, switchTime = 2000 }) => {
        const [frame, setFrame] = React.useState(0);

        React.useEffect(() => {
            const interval = setInterval(() => {
                setFrame((frame+1)%frames.length)
            }, switchTime);

            return () =>
                clearInterval(interval);

        }, [ frame, setFrame, switchTime ]);

        log("playing frame", frame)

        return <PathSVG {...{
            generator: RotPath,
            transition: `all ${switchTime/2}ms ease-in-out`,
            ...frames[frame]
        }}/>
    }
;
