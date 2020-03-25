import { Scalable, Scale } from 'linear/component/art/scale';
import { SelfSizedPathSVG } from 'linear/component/art/svg';
import React from 'react';

export interface RectProps {
    strokeWidth: number
    d: number
    fill: string
}

export const rectPath:
    Scalable<RectProps>
= {
    path({ d, strokeWidth }: RectProps) {
        const p = strokeWidth;
        return `m${p},${p}h${d - p}v${d - p}h${-d + p}z`
    },

    size({ d, strokeWidth}: RectProps) {
        return [d + strokeWidth, d + strokeWidth]
    },

    props({ strokeWidth, fill }: RectProps) {
        return { strokeWidth, fill }
    }
}

export default rectPath;

export const scaled = Scale(rectPath, 'd', 'strokeWidth');