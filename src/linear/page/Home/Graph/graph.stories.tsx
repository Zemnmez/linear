import * as t from '.';
import { number, withKnobs } from '@storybook/addon-knobs';
import { Bio } from 'linear/bio';
import React from 'react';

export default { title: 'component/page/Home', decorators: [withKnobs] }

export const Graph = () => <t.Graph {...{
    timeline,
    padding: number("padding", 60, {
        range: true,
        min: 0,
        max: 100
    })
}}/>;

const { timeline } = Bio;