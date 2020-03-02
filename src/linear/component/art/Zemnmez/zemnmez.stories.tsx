import * as rot from './zemnmez_rot';
import * as zemn from './zemnmez';
import React from 'react';
import { withKnobs, number, date, text } from "@storybook/addon-knobs";

export default { title: 'zemnmez', decorators: [withKnobs] }
export const Zemn_Rot = () =>
        <rot.SVG
        smallSquare={number("smallSquare", rot.Props.smallSquare)}
        bigSquare={number("bigSquare", rot.Props.bigSquare)}
        gap={number("gap", rot.Props.gap)}
    />

export const Zemn = () =>
        <zemn.SVG
        smallSquare={number("smallSquare", zemn.Props.smallSquare)}
        bigSquare={number("bigSquare", zemn.Props.bigSquare)}
        gap={number("gap", zemn.Props.gap)}
    />