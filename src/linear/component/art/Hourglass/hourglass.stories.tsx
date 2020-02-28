import * as t from '.';
import { withKnobs, number } from "@storybook/addon-knobs";
import React from 'react';
export default { title: 'hourglass', decorators: [withKnobs] }

const Hourglass:
    React.FC<{width: number, height: number, strokeWidth: number}>
=
    ({width, height, strokeWidth}) => <svg viewBox={`0 0 ${width} ${height}`}>
        <t.Hourglass size={[width,height]} strokeWidth={strokeWidth} />
    </svg>
;

export const Render = () => <Hourglass
    width={number("width", t.HourglassProps.size[0])}
    height={number("height", t.HourglassProps.size[1])}
    strokeWidth={number("stroke width", t.HourglassProps.strokeWidth)} />