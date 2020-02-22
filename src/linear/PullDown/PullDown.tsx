import { ElementProperties } from "linear/util";
import { ErrorBoundary } from 'linear/error';
import classes from 'linear/classes';
import React, { ForwardRefExoticComponent } from 'react';
import style from './pulldown.module.css';

export interface Menu extends React.FC<Pick<ElementProperties<"div">, 'className'>> {}

export interface Main extends React.ForwardRefExoticComponent<
    Pick<ElementProperties<"div">,"className"> & { ref: any }
> {}

export interface PullDownParams extends React.PropsWithChildren<ElementProperties<"div">> {
    children: [Menu, Main]
}


const onMainMounted = (instance: HTMLElement | null) =>
    instance && instance.scrollIntoView()


const PullDown_:
    React.FC<PullDownParams>
=
    ({
        children: [ Pulldown, Main ],
        className,
        ...props
    }) => {



        return <div {...{
            className: classes(className, style.PullDown),
            ...props
        }}>
            <Pulldown className={style.pullDownMenu}/>
            <Main className={style.main} ref={onMainMounted}/>

        </div>
    }
;


export const PullDown = ErrorBoundary(PullDown_);