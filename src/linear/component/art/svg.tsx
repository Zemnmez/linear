import React from 'react';
import style from './svg.module.css';
import { classes } from 'linear/dom/classes';

export interface RelativeArea {
    x?: undefined, y?: undefined,
    width: number, height: number
}

export interface AbsArea extends Omit<RelativeArea, 'x' | 'y'> {
    x: number, y: number,
}

export type Area = RelativeArea | AbsArea;

export interface RenderablePath<p extends Area> {
    path(p: p): string,
    props?: (props: p) => React.SVGAttributes<SVGPathElement>;
}

const mustValidPath = (path: string): string => {
    if (!(path[0] == 'm' || path[0] == 'M'))
        path = 'm0,0' + path;
    return path;
}

export const Path = <T extends Area>(c: PathProps<T>) => <path {...{
    className: classes(c.className, style.Path),
    style: {
        '--path': `path("${mustValidPath(c.generator.path(c))}")`,
        ...(c.transition?{
            '--transition': c.transition
        }: {}),
    } as any as React.CSSProperties,
    ...(c.generator.props?c.generator.props(c): {})
}}/>

interface _PathProps<T extends Area> {
    generator: RenderablePath<T>,
    transition?: string,
    className?: string,
}

export type PathProps<T extends Area> = _PathProps<T> & T;


/*
<svg class="svg_svg__z1AZg" viewBox="0,0 1000,1000"><path class="svg_svg__z1AZg" style="--path:path(&quot;m0,0l111.11111111111111,0,0,111.11111111111111,-111.11111111111111,0zm222.22222222222223,0l555.5555555555555,0,0,111.11111111111111,-555.5555555555555,0zm0,222.22222222222223l555.5555555555555,0,0,555.5555555555555,-555.5555555555555,0zm-222.22222222222223,0l111.11111111111111,0,0,555.5555555555555,-111.11111111111111,0zm222.22222222222223,666.6666666666666l555.5555555555555,0,0,111.11111111111111,-555.5555555555555,0zm666.6666666666666,0l111.11111111111111,0,0,111.11111111111111,-111.11111111111111,0zm0,-666.6666666666666l111.11111111111111,0,0,555.5555555555555,-111.11111111111111,0z&quot;);"></path></svg>

<svg class="svg_svg__z1AZg" viewBox="0,0 1000,1000"><path class="svg_Path__1PzRx" style="--path:path(m0,0l1110.111111,0,0,111.111,-111.111,0zm2220.222222,0l5550.555556,0,0,111.111,-555.556,0zm0,222.222l5550.555556,0,0,555.556,-555.556,0zm-2220.222222,0l1110.111111,0,0,555.556,-111.111,0zm2220.222222,666.667l5550.555556,0,0,111.111,-555.556,0zm6660.666667,0l1110.111111,0,0,111.111,-111.111,0zm0,-666.667l1110.111111,0,0,555.556,-111.111,0z);"></path></svg>
*/



/*
export const PathSVG =
    <T extends Area>(v: RenderablePath<T>) => (p: Omit<T, keyof Area>) => {
        const c = {
            width: 1000,
            height: 1000,
            x: 0,
            y: 0,
            ...p
        }
        const pathGen = () => {
            let res = v.path(c as T);
            if (!(res[0] == 'm' || res[0] == 'M'))
                res = 'm0,0' + res;
            return res;
        }
        return <svg className={style.svg} viewBox={`${c.x || 0},${c.y || 0} ${c.width},${c.height}`}>
            <path {...{
                className: style.svg,
                style: ({ ...{'--path': `path("${pathGen()}")`} as React.CSSProperties, ...(
                    v.props?v.props(p as T):{}
                )}) as React.CSSProperties
            }}/>
        </svg>
    }
*/

export type SVGProps<T extends Area> = Omit<
    PathProps<T>,
    'width' | 'height' | 'x' | 'y'
>

export const PathSVG =
    <T extends Area>(p: SVGProps<T>) => {
        const c: PathProps<T> = {
            width: 1000,
            height: 1000,
            x: 0,
            y: 0,
            ...p
        } as any;



        return <svg
            className={classes(style.svg, p.className)}
            viewBox={`${c.x || 0},${c.y || 0} ${c.width},${c.height}`}>

            <Path
                {...c as any}/>

        </svg>
    }