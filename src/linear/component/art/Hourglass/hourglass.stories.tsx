import pathGen, * as t from '.';
import { withKnobs, number, color } from "@storybook/addon-knobs";
import React from 'react';
export default { title: 'component/art', decorators: [withKnobs] }

export const Hourglass = () => <t.HourglassSVG {...{
    w: number("width", 10),
    h: number("height", 10),
    strokeWidth: number("stroke width", .1),
    stroke: color("stroke", "black")
}} />