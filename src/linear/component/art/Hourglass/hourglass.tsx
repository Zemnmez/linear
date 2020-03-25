import React from 'react';
import { Scale } from 'linear/component/art/scale';
import { PathSVG } from 'linear/component/art/svg';

export interface HourglassConfig {
    w: number, h: number,
    strokeWidth: number, stroke: string
}

export const Hourglass = {
    size({ w, h, strokeWidth }: HourglassConfig): [number, number] { return [w+strokeWidth, h+strokeWidth] },
    path({ w, h, strokeWidth }: HourglassConfig) {
        const padding = strokeWidth / 2;
        return `m${padding},${padding}h${w}l${-w},${h}h${w}z`
    },
    props({ stroke, strokeWidth }: HourglassConfig): React.SVGAttributes<SVGPathElement> {
        return { strokeWidth, fill: "none", stroke }
    }
}

export const scaled = Scale(Hourglass, 'w', 'h', 'strokeWidth');

export interface HourglassSVGProps extends Partial<HourglassConfig> {
    className?: string
}

export const HourglassSVG =
    ({ w = 10, h = 10, strokeWidth = .5, stroke = "black", className }: HourglassSVGProps) => <PathSVG {...{
        generator: Hourglass,
        w, h, strokeWidth, stroke, className
    }}/>

export default HourglassSVG;