
import React from 'react';

import { storiesOf } from 'lib/stories'
import { MemoryRouter as Router } from 'react-router'

import Link from ".";

storiesOf(module)
  .add('external', () => <Link to="https://google.com">google</Link>)
  .add('internal', () => <Router><Link to="/cool/beans">beans</Link></Router>)
  .add('notinline', () => <Router><Link notinline to="/cool/beans">beans</Link></Router>)

