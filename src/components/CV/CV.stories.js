
import React from 'react';

import { storiesOf } from 'lib/stories'
import { MemoryRouter as Router } from 'react-router'

import bio from 'bio'
import CV from 'components/CV'

const { timeline } = bio

storiesOf(module)
  .add('default', () => <Router><CV {...{
    data: bio,
    style: {
      "--fgc": "black",
      "--bgc": "white"
    }
  }}/></Router>)
