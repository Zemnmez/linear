import React from 'react';

import { storiesOf } from 'lib/stories';

import "components/App/App.css";

import { App } from 'components/App/App.module.css';
import { base, darkMode, lightMode } from 'components/colors.module.css';


import SadHumans from '.';

storiesOf(module)
  .add('default', () => <SadHumans {...{
    className: [App, base],
  }}/>)
