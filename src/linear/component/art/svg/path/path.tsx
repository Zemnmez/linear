import React from 'react';

/**
 * Area is a value with given width and height
 */
export interface Area {
    width: number, height: number
}

/**
 * a Path is an SVG path generator.
 */
export interface Path<cfg extends object> {
    /**
     * Generates a path string from a config
     */
    path(cfg: cfg): string

    /**
     * Returns the size (in local svg units)
     * of the output path
     */
    size(cfg: cfg): [number, number]

    /**
     * Optional properties for the <path> tag
     */
    props?: (cfg: cfg) => React.SVGAttributes<SVGPathElement>
}

/**
 * An SVG path generator that can be rendered at a given size.
 */
export interface Sized<cfg extends Area> extends Omit<Path<cfg>, 'size'> {}

/**
 * An SVG path is actually invalid if it doesn't start
 * with a move instruction (mX,Y). This adds one
 * if there isnt one already.
 */
export const mustValidPath = (path: string): string => {
    if (!(path[0] == 'm' || path[0] == 'M'))
        path = 'm0,0' + path;
    return path;
}

/**
 * Data on a rendered path.
 */
export interface PathData extends Area {
    path: ReturnType<Path<any>["path"]>
    props?: ReturnType<Exclude<Path<any>["props"], undefined>>
}

/**
 * Render a regular self-sizing path to PathData.
 */
export const Render:
    <cfg extends object>(gen: Path<cfg>, cfg: cfg) => PathData
=
    (gen, cfg) => {
        const [ width, height ] = gen.size(cfg);
        return {
            path: mustValidPath(gen.path(cfg)),
            props: gen.props? gen.props(cfg): gen.props,
            width, height
        }
    }
;

/**
 * Render a scalable path to PathData.
 */
export const RenderSized:
    <cfg extends Area>(gen: Sized<cfg>, cfg: cfg) => PathData
=
    (gen, cfg) => {
        const { width, height } = cfg;
        return {
            path: mustValidPath(gen.path(cfg)),
            props: gen.props? gen.props(cfg): gen.props,
            width, height
        }
    }
;






