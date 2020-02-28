import React from 'react';

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
