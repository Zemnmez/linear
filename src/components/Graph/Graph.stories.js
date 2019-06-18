
import React from 'react';

import { storiesOf } from '@storybook/react';

import bio from 'bio'
import Graph from 'components/Graph'

const { timeline } = bio

storiesOf('Graph', module)
  .add('with text', () => <Graph {...{
    timeline
  }}/>)
