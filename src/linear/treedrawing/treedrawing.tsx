import { Rect } from './vec';
export interface TreeCanvas {
    clear(): void
    Path(): Pather
    size<X extends number,Y extends number>(rect: Rect<X,Y>): void
}


export interface Pather {
    Abs: PathCommand
    Rel: PathCommand
}

export interface PathCommand {
    LineTo<X extends number, Y extends number>(pt: Point<X,Y>): Pather
    MoveTo<X extends number, Y extends number>(pt: Point<X,Y>): Pather
}


export interface TreeProps {
    canvas: TreeCanvas
    size?: Rect
    trunkSize?: number
    /** tick length in milliseconds */
    t?: number
    /** number of milliseconds to go through */
    tMax?: number
}

export const DrawTree:
    (p: TreeProps) => void
=
    ({
        canvas: ctx,
        size = [100, 100],
        tMax = 8000,
        t = 500
    }) => {
        const [width, height] = size;
        ctx.clear();
        ctx.size([width, height]);

        const Trunk = () => {
            const p = ctx.Path();
            p.Abs.MoveTo([0,0])
        }

    }
;