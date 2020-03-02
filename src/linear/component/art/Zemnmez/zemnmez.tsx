import * as rot from './zemnmez_rot';
import React from 'react';
import { ViewBoxed } from '../art';

export interface Props extends rot.Props {}

const rotation = Math.PI / 4; // 45 deg

export const Size = (p: Props) => rot.Size(p).map(k => k / Math.sin(rotation)) as [number, number];
export const Props = rot.Props;

export const ZemnmezElement:
    React.FC<Props>
=
    p => {
        const oldSize = rot.Size(p);
        const newSize = Size(p);
        const center = oldSize.map(v => v/2);
        const offset = (newSize[0] - oldSize[0])/2;

        return <rot.Element transform={`rotate(-45,${center})`+
            // because we're slightly larger now in both dimensions
            `translate(${[offset,offset]})`} {...p}/>
    }
;

export const SVG = ViewBoxed(ZemnmezElement, Size);

export default SVG;