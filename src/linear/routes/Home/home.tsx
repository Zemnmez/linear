//import { ErrorBoundary } from "linear/error";
import { Timeline } from "linear/timeline";
import { Bio } from 'linear/timeline/bio';
import { Header } from 'linear/header';
import * as React from 'react';
import { classes } from 'linear/classes';
import style from './home.module.css';
import { Time } from 'linear/assets';


const Home_ = React.forwardRef((
    { className, ...props}: JSX.IntrinsicElements["div"],
    ref: React.Ref<HTMLDivElement>) => <div ref={ref} className={classes(className, style.Home)} {...props}>
    <Header className={style.Header} name={Bio.who.handle}/>
    <Time className={style.Time} />
    <Timeline className={style.Timeline} {...Bio} />
</div>);

export const Home = Home_;