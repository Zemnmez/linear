import React from 'react';

import { storiesOf } from '@storybook/react';

import bio from 'bio'
import Timeline from 'components/Timeline'

const { timeline } = bio

storiesOf('Timeline', module)
  .add('default', () => <Timeline {...{
    timeline
  }}/>)
