import React from 'react';

import { storiesOf } from 'lib/stories';

import "components/App/App.css";

import { componentStories } from 'storyhelper';

import bio from 'bio'
import Home from '.';

const { timeline } = bio

let stories = storiesOf(module);

componentStories({ stories, component: Home, props: { data: bio} });
