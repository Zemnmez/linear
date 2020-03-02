import React from 'react';
import { Path } from '../svg/path';
import * as cmd from '../svg/path/command';

type Point = Parameters<
    (X: number, Y: number) => never
>

type WH = Parameters<
    (width: number, height: number) => never
>

export interface HourglassConfig {
    size?: WH,
    strokeWidth?: number
}

export interface HourglassProps extends Omit<React.SVGProps<SVGGElement>, 'strokeWidth'>, HourglassConfig {
    pathProps?: React.SVGProps<SVGPathElement>
}

export const HourglassProps = {
    size: [ 10, 10 ],
    strokeWidth: 1
}

export const HourglassPath:
    (p: HourglassProps) =>
        Path
=
    ({
        size: [ width, height ] = HourglassProps.size,
        strokeWidth = HourglassProps.strokeWidth,
    }) => {
        const paddingFromStroke = strokeWidth /2;
        const padding = paddingFromStroke;

        return [
            [cmd.MoveToAbs, [padding, padding]],
            [cmd.LineToAbs, [width - padding, padding]],
            [cmd.LineToAbs, [padding, height - padding]],
            [cmd.LineToAbs, [width - padding, height - padding]],
            [cmd.ClosePath]
        ]
    }
;

export const Hourglass:
    React.FC<HourglassProps>
= ({ size: [ width, height ] = HourglassProps.size, strokeWidth = HourglassProps.strokeWidth, pathProps, ...groupProps}) =>{
    const paddingFromStroke = strokeWidth /2;
    const padding = paddingFromStroke;
    const [ TL, TR, BL, BR ] = [
        [padding, padding],
        [width - padding, padding],
        [padding, height - padding],
        [width - padding, height - padding]
    ]

    return <g {...groupProps}>
        <path {...{
            d: `
            M ${TL}
            L ${TR}
            L ${BL}
            L ${BR}
            Z
            `,
            style: {
                stroke: 'black',
                strokeWidth,
                fill: 'none'
            },
            ...pathProps
        }}/>
    </g>
}
