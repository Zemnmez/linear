//import { ErrorBoundary } from "linear/error";
import { Timeline } from "linear/page/Home/Timeline";
import { Header } from 'linear/page/Home/Header';
import { Bio } from 'linear/bio';
import { classes } from 'linear/dom/classes';
import * as React from 'react';
import style from './home.module.css';
import { WideEyeOrnament } from "./WideEyeOrnament";
import { Graph } from "./Graph";
import PhotoStream from 'linear/component/PhotoStream/photostream';
import { Divider } from 'linear/component/Divider';


export interface HomeProps {
    className?: string
}

console.log(style.Home, classes(style.Home));

const Home_ = React.forwardRef<HTMLDivElement, HomeProps>((
    { className }: JSX.IntrinsicElements["div"], ref) =>
    <div ref={ref} {...classes(style.Home, className)}>

    <Header className={style.Header} name={Bio.who.handle}/>
    <WideEyeOrnament className={style.WideEyeOrnament} />
    <Timeline className={style.Timeline} {...Bio} />
    <Divider className={style.Divider}> ⁂ </Divider>
    <Graph {...{
        timeline: Bio.timeline,
        className: style.Graph
    }}/>
</div>);

export const Home = Home_;

export default Home;