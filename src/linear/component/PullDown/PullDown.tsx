import { ElementProperties } from "linear/util";
import { ErrorBoundary } from 'linear/component/ErrorBoundary';
import classes from 'linear/dom/classes';
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

        const [smooth, setSmooth] = React.useState(false);

        const onMainMounted = React.useCallback(
            (instance: HTMLElement | null) => {
                if(!instance) return;
                instance.scrollIntoView({
                    behavior: smooth? "smooth": "auto"
                });
                setSmooth(true);
        }, [ smooth ])



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