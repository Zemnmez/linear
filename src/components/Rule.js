import React from 'react';
import style from './index.module.css';

export default ({ children, className }) => <div {...{
  className: [style.rule].concat(className).join(" ")
}}><span>{children}</span></div>
