
import React from 'react';

import { storiesOf } from 'lib/stories'

import bio from 'bio'
import Graph from 'components/Graph'

const { timeline } = bio

storiesOf(module)
  .add('default', () => <Graph {...{
    timeline
  }}/>)
