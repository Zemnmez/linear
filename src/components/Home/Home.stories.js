import React from 'react';

import { storiesOf } from 'lib/stories';

import "components/App/App.css";

import appStyle from 'components/App/App.module.css';

import bio from 'bio'
import Home from '.';

const { timeline } = bio

storiesOf(module)
  .add('default', () => <Home {...{
    data: bio,
    className: appStyle.App
  }}/>)
