import * as command from '../command';
import { Point2d as Point, X, Y } from '../vec';

type Points2d=
    (p1: Point, ...pn: Point) => never;
type Xs =
    (x1: X, ...xn: X[]) => never;

type Ys =
    (x1: Y, ...yn: Y[]) => never;

export type CubicBezier = Parameters<
    (x1: number, y1: number, x2: number, y2: number, x: number, y: number) => never
>;

export type CubicBeziers =
    (b1: CubicBezier, ...bn: CubicBezier[]) => never;

export type SmoothCubicBezier = Parameters<
    (x2: number, y2: number, x: number, y: number) => never
>;

export type SmoothCubicBeziers =
    (b1: SmoothCubicBezier, ...bn: SmoothCubicBezier[]) => never;

export type QuadraticBezier = Parameters<
    (x1: number, y1: number, x: number, y: number) => never
>;

export type QuadraticBeziers =
    (b1: QuadraticBezier, ...bn: QuadraticBezier[]) => never;

export type EllipticalArc = Parameters<
    (rx: number, ry: number, xAxisRotation: number,
    largeArc: 1 | 0, sweep: 1 | 0, x: number, y: number) => never
>;

export type EllipticalArcs =
        (e1: EllipticalArc, ...en: EllipticalArc[]) => never;

export type ParamMap = {
    LineToRel: Points2d,
    LineToAbs: Points2d,
    LineTo: Points2d,

    MoveToRel: Points2d,
    MoveToAbs: Points2d,
    MoveTo: Points2d,

    LineToHorizAbs: Xs,
    LineToHorizRel: Xs,
    LineToHoriz: Xs,

    LineToVertAbs: Ys,
    LineToVertRel: Ys,
    LineToVert: Ys,

    BezierToCubicAbs: CubicBeziers,
    BezierToCubicRel: CubicBeziers,
    BezierToCubic: CubicBeziers;

    BezierToSmoothAbs: SmoothCubicBeziers,
    BezierToSmoothRel: SmoothCubicBeziers,
    BezierToSmooth: SmoothCubicBeziers,

    BezierToQuadraticAbs: QuadraticBeziers,
    BezierToQuadraticRel: QuadraticBeziers,
    BezierToQuadratic: QuadraticBeziers,

    BezierToSmoothQuadraticAbs: Points2d,
    BezierToSmoothQuadraticRel: Points2d,
    BezierToSmoothQuadratic: Points2d,

    EllipticalArcAbs: EllipticalArcs,
    EllipticalArcRel: EllipticalArcs,
    EllipticalArc: EllipticalArcs,

    ClosePath: () => never;
}

export type Map = {
    [k in keyof ParamMap]:
        (cmd: command.ByName[k], ...args: Parameters<ParamMap[k]>) => never
}
export type LineToRel = Map["LineToRel"];
export type LineToAbs = Map["LineToAbs"];
export type MoveToRel = (cmd: command.MoveToRel, p1: Point, ...pn: Point[]) => never;
export type MoveToAbs = (cmd: command.MoveToAbs, p1: Point, ...pn: Point[]) => never;
export type MoveTo = (cmd: command.MoveTo, p1: Point, ...pn: Point) => never;
export type LineTo = (cmd: command.LineTo, p1: Point, ...pn: Point) => never;
export type LineToHoriz = (cmd: command.LineToHoriz, x1: X, ...xn: X[]) => never;
export type LineToHorizAbs = (cmd: command.LineToHorizAbs, x1: X,  ...xn: X[]) => never;
export type LineToHorizRel = (cmd: command.LineToHorizRel, x1: X, ...xn: X[]) => never;
export type LineToVertAbs = (cmd: command.LineToVertAbs, y1: Y, ...yn: Y[]) => never;
export type LineToVertRel = (cmd: command.LineToVertRel, y1: Y, ...yn: Y[]) => never;
export type LineToVert = (cmd: command.LineToVert, y1: Y, ...yn: Y[]) => never;
export type ClosePath = (cmd: command.ClosePath) => never;