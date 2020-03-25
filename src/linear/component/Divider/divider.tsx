import style from './divider.module.css';
import React from 'react';
import { classes } from 'linear/dom/classes';

export interface DividerProps {
    className?: string
}

export const Divider:
    React.FC<DividerProps>
=
    ({ children, className }) => <div {...{
        ...classes(style.Divider, className)
    }}>
        <div>{children}</div>
    </div>
;

export default Divider;