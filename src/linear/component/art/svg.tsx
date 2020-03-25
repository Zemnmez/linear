import React from 'react';
import style from './svg.module.css';
import { classes } from 'linear/dom/classes';

export interface Area {
    width: number, height: number
}

/**
 * A path that can be rendered in a given size
 */
export interface SizedPath<p extends Area> {
    path(p: p): string,
    props?: (p: p) => React.SVGAttributes<SVGPathElement>
}

/**
 * A path which determines its own size.
 *
 * This seems kinda weird, but it's essentially
 * to allow these values to be hand picked to minimise
 * svg render size.
 */
export interface SelfSizedPath<p extends object> {
    path(p: p): string,
    size(p: p): [number, number],
    props?: (p: p) => React.SVGAttributes<SVGPathElement>
}

interface _SelfSizedPathProps<p extends object> {
    generator: SelfSizedPath<p>,
    className?: string
}

export type SelfSizedPathProps<p extends object> =
    _SelfSizedPathProps<p> & p;

/**
 * Render a self-sized path generator to an SVG.
 */
export const SelfSizedPathSVG =
    <p extends object>(props: SelfSizedPathProps<p>) =>
    <svg {...{
        viewBox: `0,0 ${props.generator.size(props)}`,
        ...classes(style.svg, props.className)
    }}>
        <path d={mustValidPath(props.generator.path(props))} {...props.generator.props?props.generator.props(props): {}}/>
    </svg>


/**
 * An SVG path is actually invalid if it doesn't start
 * with a move instruction (mX,Y). This adds one
 * if there isnt one already.
 */
const mustValidPath = (path: string): string => {
    if (!(path[0] == 'm' || path[0] == 'M'))
        path = 'm0,0' + path;
    return path;
}

interface PathStyleProps {
    path: string,
    transition?: string
}

const PathStyle:
    (props: PathStyleProps) => React.CSSProperties
=
    ({ path, transition }) => ({
        '--path': `path("${mustValidPath(path)})`,
        ...(transition?{
            '--transition': transition
        }: {})
    } as any as React.CSSProperties)
;


interface _PathProps<cfg extends Area> {
    generator: SizedPath<cfg>,
    className?: string,
    transition?: string
}

export type PathProps<cfg extends Area> = _PathProps<cfg> & cfg

/**
 * Render a path that can be scaled to size
 * to an SVG path.
 */
const SizedPath = <
    cfg extends Area
>(
    props: PathProps<cfg>
) => <path {...{
    ...classes(props.className, style.Path),
    style: PathStyle({
        path: props.generator.path(props),
        transition: props.transition
    })
}}/>


/**
 * Render a path that can be rendered at given
 * size to an SVG.
 *
 * This mode of operation allows animation.
 */
export const SizedPathSVG =
    <T extends Area>(p: Omit<PathProps<T>, 'width' | 'height'>) => {
        const c: PathProps<T> = {
            width: 1000,
            height: 1000,
            ...p
        } as any;



        return <svg {...{
            ...classes(style.svg, p.className),
            viewBox: `0,0 ${c.width},${c.height}`
        }}>
            <SizedPath {...c} />
        </svg>
    }

export const PathSVG: {
    <T extends Area>(p: Omit<PathProps<T>, 'width' | 'height'>): JSX.Element,
    <T extends object>(p: SelfSizedPathProps<T>): JSX.Element
}

=
    // TODO: theres a bug here i dont want to fix
    (p: PathProps<any> | SelfSizedPathProps<any>) =>
        "width" in p? SizedPathSVG(p): SelfSizedPathSVG(p)
;