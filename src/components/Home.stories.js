import React from 'react';

import { storiesOf } from '@storybook/react';

import "components/App/App.css";

import appStyle from 'components/App/App.module.css';

import bio from 'bio'
import Home from 'components/Home';

const { timeline } = bio

storiesOf('page', module)
  .add('home', () => <Home {...{
    data: bio,
    className: appStyle.App
  }}/>)
