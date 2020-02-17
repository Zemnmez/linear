import { ElementProperties } from "linear/util";
import { ErrorBoundary } from 'linear/error';
import classes from 'linear/classes';
import React from 'react';
import style from './pulldown.style.module.css';

export type PullDownChild = React.FC<{
    className?: ElementProperties<"div">["className"]
}>

export interface PullDownParams extends React.PropsWithChildren<ElementProperties<"div">> {
    children: [PullDownChild, PullDownChild]
}

const pullDown:
    React.FC<PullDownParams>
=
    ({
        children: [ Pulldown, Main ],
        className,
        ...props
    }) => <div {...{
        className: classes(className, style.PullDown),
        ...props
    }}>
        <Pulldown {...{
            className: style.pullDownManu
        }}/>

        <Main {...{
            className: style.main
        }}/>

    </div>
;

export const PullDown = ErrorBoundary(pullDown);