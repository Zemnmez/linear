//import { ErrorBoundary } from "linear/error";
import { Timeline } from "linear/page/Home/Timeline";
import { Header } from 'linear/page/Home/Header';
import { Bio } from 'linear/bio';
import { classes } from 'linear/dom/classes';
import { TimeEye } from 'linear/component';
import * as React from 'react';
import style from './home.module.css';


const Home_ = React.forwardRef((
    { className, ...props}: JSX.IntrinsicElements["div"],
    ref: React.Ref<HTMLDivElement>) => <div ref={ref} className={classes(className, style.Home)} {...props}>
    <Header className={style.Header} name={Bio.who.handle}/>
    <Time className={style.Time} />
    <Timeline className={style.Timeline} {...Bio} />
</div>);

export const Home = Home_;