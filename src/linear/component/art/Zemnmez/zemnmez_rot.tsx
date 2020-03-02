import React from 'react';
import { ViewBoxed } from '../art';
import { Path as SVGPath } from './../svg/path';
import * as cmd from '../svg/path/command';
export interface Config {
    smallSquare: number
    bigSquare: number
    gap: number
}

export interface Props extends React.SVGAttributes<SVGGElement>, Config { }

export const Props = {
    smallSquare: 1,
    bigSquare: 5,
    gap: 1
}

export const Size = ({smallSquare:S, bigSquare:B, gap:G}: Props): [number, number] =>
    [S+G+B+G+S, S+G+B+G+S]

export const Path:
    (f: typeof Props) => SVGPath
=
    ({ smallSquare, bigSquare, gap, ...attr}) => {
        const rect = (w: number, h: number): SVGPath => [
            [cmd.LineToHorizRel, [w]],
            [cmd.LineToVertRel, [h]],
            [cmd.LineToHorizRel, [-w]],
            [cmd.ClosePath]
        ];
        const sq = (w: number) => rect(w,w);
        return [
            // top left small sq
            [cmd.MoveToAbs, [0, 0]],
            ...sq(smallSquare),

            // top rectangle
            [cmd.MoveToAbs, [smallSquare+gap, 0]],
            ...rect(bigSquare, smallSquare),

            // left rectangle
            [cmd.MoveToAbs, ]
        ]
        return <g {...attr}>
            <path {...{
                d:
                // top left small sq
                `M0,0`+
                `${sq(smallSquare)}` +

                // draw top rectangle
                `M${smallSquare+gap},0`+
                `${rect(bigSquare, smallSquare)}` +

                // draw left rectangle
                `M0,${smallSquare+gap}` +
                `${rect(smallSquare, bigSquare)}` +

                // draw center square
                `M${smallSquare+gap},${smallSquare+gap}` +
                `${sq(bigSquare)}` +

                // draw bottom rectangle
                `M${smallSquare+gap},${smallSquare+gap+bigSquare+gap}`+
                `${rect(bigSquare,smallSquare)}` +

                // draw bottom right square
                `M${smallSquare+gap+bigSquare+gap},${smallSquare+gap+bigSquare+gap}` +
                `${sq(smallSquare)}`+

                // draw right rectangle
                `M${smallSquare+gap+bigSquare+gap},${smallSquare+gap}`+
                `${rect(smallSquare,bigSquare)}`
            }}/>
        </g>
    }
;

export const Element:
    React.FC<Props>
=
    ({ smallSquare, bigSquare, gap, ...attr}) => {
        const rect = (w: number, h: number) => `h${w}v${h}h${-w}z`;
        const sq = (w: number) => rect(w,w);
        return <g {...attr}>
            <path {...{
                d:
                // top left small sq
                `M0,0`+
                `${sq(smallSquare)}` +

                // draw top rectangle
                `M${smallSquare+gap},0`+
                `${rect(bigSquare, smallSquare)}` +

                // draw left rectangle
                `M0,${smallSquare+gap}` +
                `${rect(smallSquare, bigSquare)}` +

                // draw center square
                `M${smallSquare+gap},${smallSquare+gap}` +
                `${sq(bigSquare)}` +

                // draw bottom rectangle
                `M${smallSquare+gap},${smallSquare+gap+bigSquare+gap}`+
                `${rect(bigSquare,smallSquare)}` +

                // draw bottom right square
                `M${smallSquare+gap+bigSquare+gap},${smallSquare+gap+bigSquare+gap}` +
                `${sq(smallSquare)}`+

                // draw right rectangle
                `M${smallSquare+gap+bigSquare+gap},${smallSquare+gap}`+
                `${rect(smallSquare,bigSquare)}`
            }}/>
        </g>
    }
;

export const SVG = ViewBoxed(Element, Size);

export default SVG;