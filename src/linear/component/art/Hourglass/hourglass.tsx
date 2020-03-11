import React from 'react';
import { Area } from '../svg';
import { DefaultProps, Type } from 'linear/component/defaults';

export interface HourglassProps extends Area {
    strokeWidth?: number,
    stroke: React.SVGAttributes<SVGPathElement>["stroke"]
}


export const HourglassProps: DefaultProps<HourglassProps> = {
    width: Object.assign(10, {
        range:  {
            min: 0,
            max: 100,
            step: 1
        }
    }),

    height: Object.assign( 10, {
        range: {
            min: 0,
            max: 100,
            step: 1
        }
    }),

    x: 0,

    y: 0,

    stroke: Object.assign('black', {
        type: Type.color as Type.color
    }),

    strokeWidth: Object.assign(1, {
        range: {
            min:0,
            max: 100,
            step: 1
        }
    })
}

export const HourglassPath:
    (p: HourglassProps) =>
        string
=
    ({
        width = HourglassProps.width,
        height = HourglassProps.height,
        x = HourglassProps.x,
        y = HourglassProps.y,
        strokeWidth = HourglassProps.strokeWidth,
    }) => {
        const paddingFromStroke = strokeWidth /2;
        const padding = paddingFromStroke;
        const innerWidth = width - padding;
        const innerHeight = height - padding;

        return `m${[padding,padding]}l${[innerWidth, 0]} ${[-innerWidth, innerHeight]} ` +
            `${[innerWidth, 0]}z`;
    }
;

export const Props =
    ({ strokeWidth, stroke = "black" }: HourglassProps): React.SVGAttributes<SVGPathElement> =>
        ({ strokeWidth, fill: "none", stroke })

export default {
    path: HourglassPath,
    props: Props
}