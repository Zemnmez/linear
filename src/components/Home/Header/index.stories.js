import React from 'react';

import {storiesOf} from 'lib/stories';


import { App } from 'components/App/App.module.css';
import { base } from 'components/colors.module.css';

import { Header } from '.';

import bio from 'bio';

storiesOf(module)
    .add('default', () => <Header{...{
        className: [App, base],
        ...bio
    }}/>);
