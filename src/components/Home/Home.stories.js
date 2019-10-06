import React from 'react';

import { storiesOf } from 'lib/stories';

import "components/App/App.css";

import { App } from 'components/App/App.module.css';
import { base } from 'components/colors.module.css';

import bio from 'bio'
import Home from 'components/Home';

let stories = storiesOf(module)
    .add('default', () => <Home {...{
        className: [App, base],
        data: bio
    }}/>);
