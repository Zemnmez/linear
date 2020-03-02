export const CommandMap = {
    LineToRel: 'l',
    LineToAbs: 'L'
}

export type Map = {
    LineToRel: typeof LineToRel,
}

export const LineToRel = 'l';
export type LineToRel = typeof LineToRel;
export const LineToAbs = 'L';
export type LineToAbs = typeof LineToAbs;
export type LineTo = LineToRel | LineToAbs;
export const MoveToAbs = 'M';
export type MoveToAbs = typeof MoveToAbs;
export const MoveToRel = 'm';
export type MoveToRel = typeof MoveToRel;
export type MoveTo = MoveToRel | MoveToAbs;
export const LineToHorizAbs = 'H';
export type LineToHorizAbs = typeof LineToHorizAbs;
export type LineToHorizRel = 'h';
export const LineToHorizRel: LineToHorizRel = 'h';
export type LineToHoriz = LineToHorizAbs | LineToHorizRel;
export type LineToVertAbs = 'V'
export const LineToVertAbs: LineToVertAbs = 'V';
export type LineToVertRel = 'v'
export const LineToVertRel: LineToVertRel = 'v';
export type LineToVert = LineToVertAbs | LineToVertRel;
export type BezierToCubicAbs = 'C'
export const BezierToCubicAbs: BezierToCubicAbs = 'C';
export type BezierToCubicRel = 'c'
export const BezierToCubicRel: BezierToCubicRel = 'c';
export type BezierToCubic = BezierToCubicAbs | BezierToCubicRel;
export type BezierToSmoothAbs = 'S'
export type BezierToSmoothRel = 's'
export type BezierToSmooth = BezierToSmoothAbs | BezierToSmoothRel;
export type BezierToQuadraticAbs = 'Q'
export type BezierToQuadraticRel = 'q'
export type BezierToQuadratic = BezierToQuadraticAbs | BezierToQuadraticRel;
export type BezierToSmoothQuadraticAbs = 'T'
export type BezierToSmoothQuadraticRel = 't'
export type BezierToSmoothQuadratic = BezierToSmoothQuadraticAbs | BezierToSmoothQuadraticRel;
export type EllipticalArcAbs = 'A'
export type EllipticalArcRel = 'a'
export type EllipticalArc = EllipticalArcAbs | EllipticalArcRel;
export type ClosePath = 'z' | 'Z'
export const ClosePath = 'z';
export type Command =
    LineTo | MoveTo | LineToHoriz | LineToVert |
    BezierToCubic | BezierToSmooth | BezierToQuadratic |
    BezierToSmoothQuadratic | EllipticalArc | ClosePath;
export type Rel =
    LineToRel | MoveToRel | LineToHorizRel |
    BezierToCubicRel | BezierToSmoothRel |
    BezierToQuadraticRel | BezierToSmoothQuadraticRel |
    EllipticalArcRel | LineToVertRel;
export type Abs = Exclude<Command, Rel | ClosePath>;
export default Command;
