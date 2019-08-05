import React from 'react';

import { storiesOf } from '@storybook/react';

import "../App/App.css";

import bio from 'bio'
import Timeline, { Event } from 'components/Timeline'

const { timeline } = bio

storiesOf('Timeline', module)
  .add('default', () => <Timeline {...{
    timeline
  }}/>)

storiesOf('Timeline', module)
  .add('event', () => <Event {...{
    title: 'a thing that happened',
    date: new Date(),
    tags: ['tag1', 'tag2', 'tag3'],
    url: 'https://google.com',
    description: 'Something happened on this date!',
    longDescription: 'Something very happened on this date! lorem ipsum dolor sit amet',
    duration: '10 years'
  }}/>)
