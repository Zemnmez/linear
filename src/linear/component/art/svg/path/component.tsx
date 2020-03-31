import * as path from './path';
import { classes } from 'linear/dom/classes';
import React from 'react';


export interface PathSVGProps<cfg extends object> {
    gen: path.Path<cfg>,
    cfg: cfg,
    className?: string
}

/**
 * Draw a path generator to an SVG.
 */
export const PathSVG:
    <cfg extends object>(props: PathSVGProps<cfg> )
        => React.ReactElement
=
    ({ gen, cfg, className }) => {
        const { path: sPath, props, width, height } =
            path.Render(gen, cfg);

        return <svg viewBox={`0 0 ${width} ${height}`} {...{
            ...classes(className)
        }}>
            <path {...{
                d: sPath,
                ...props
            }}/>
        </svg>
    }
;

interface SizedSVGProps<cfg extends Record<string, any>> {
    /**
     * The path generator
     */
    gen: path.Path<cfg>

    /**
     * The parameters to the path generator
     */
    cfg: Omit<cfg, keyof path.Area>

    /**
     * CSS transition for animation purposes.
     * @default "all 3s ease-in-out"
     */
    transition?: string

    /**
     * class for the generated SVG element
     */
    className?: string
}

/**
 * Draw an SVG that can be scaled to size.
 * 
 * Using this instead of PathSVG allows animations.
 */
export const SizedSVG:
    <cfg extends path.Area>(props: SizedSVGProps<cfg>)
        => React.ReactElement
=
    ({ gen, cfg, transition = "all 3s ease-in-out", className }) => {
        const [ width, height ] = [1000, 1000];
        const { path: sPath, props } =
            path.Render(gen, {...cfg, width, height} as any);

        return <svg viewBox={`0 0 ${width} ${height}`} {...{
            ...classes(className)
        }}>
            <path {...{
                style: {
                    d: sPath,
                    transition,
                    ...props
                } as any
            }}/>
        </svg>
    }
;