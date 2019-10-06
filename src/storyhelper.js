import React from 'react';
import { App } from 'components/App/App.module.css';
import { base, darkMode, lightMode } from './components/colors.module.css';
export const componentStories = ({stories, component, props: { className, ...props } }) =>
    Object.entries({base, darkMode, lightMode}).map(
      ([name, className]) => stories = stories.add(name, () =>
        React.createElement(component, {
          className: [App, className, ...className],
          ...props
        }))
);
