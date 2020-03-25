import style from './error.module.css';
import { classes } from 'linear/dom/classes';
import React from 'react';

export interface ErrorBoxProps {
    className?: string,
    children?: React.ReactNode
}

/**
 * A big box with an x in it. Content is dumped
 * below the x.
 */
export const ErrorBox =
    React.forwardRef<HTMLDivElement, ErrorBoxProps>(({ children, className }, ref) => <div {...{
        ...classes(style.Error, className),
        ref
    }}>
        <div className={style.ErrorString}>
            {children}
        </div>
    </div>
    )
;

export default ErrorBox;