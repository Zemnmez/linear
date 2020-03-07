import * as letter from './letter';

export type ByName = {
    LineToRel: LineToRel,
    LineToAbs: LineToAbs,
    LineTo: LineTo,

    MoveToRel: MoveToRel,
    MoveToAbs: MoveToAbs,
    MoveTo: MoveToRel | MoveToAbs,

    LineToHorizAbs: LineToHorizAbs,
    LineToHorizRel: LineToHorizRel,
    LineToHoriz: LineToHorizAbs | LineToHorizRel,

    LineToVertAbs: LineToVertAbs,
    LineToVertRel: LineToVertRel,
    LineToVert: LineToVert,

    BezierToCubicAbs: BezierToCubicAbs,
    BezierToCubicRel: BezierToCubicRel,
    BezierToCubic: BezierToCubicAbs | BezierToCubicRel,

    BezierToSmoothAbs: BezierToSmoothAbs,
    BezierToSmoothRel: BezierToSmoothRel,
    BezierToSmooth: BezierToSmooth,

    BezierToQuadraticAbs: BezierToQuadraticAbs,
    BezierToQuadraticRel: BezierToQuadraticRel,
    BezierToQuadratic: BezierToQuadratic,

    BezierToSmoothQuadraticAbs: BezierToSmoothQuadraticAbs,
    BezierToSmoothQuadraticRel: BezierToSmoothQuadraticRel,
    BezierToSmoothQuadratic: BezierToSmooth

    EllipticalArcAbs: EllipticalArcAbs,
    EllipticalArcRel: EllipticalArcRel,
    EllipticalArc: EllipticalArc,

    ClosePath: ClosePath
}


export type InvertAbsRel<cmd extends Command> =
    letter.InvertCase<cmd>;

export const InvertAbsRel =
    <c extends Command>(c: c): InvertAbsRel<c> =>
        letter.InvertCase(c);

export type ToAbs<cmd extends Command> =
    letter.ToUpperCase<cmd>;

export const ToAbs =
    <c extends Command>(c: c): ToAbs<c> =>
        letter.ToUpperCase(c);

export type ToRel<cmd extends Command> =
    letter.ToLowerCase<cmd>;

export const ToRel =
    <c extends Command>(c: c): ToRel<c> =>
        letter.ToLowerCase(c);

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


export const BezierToCubicAbs = 'C';
export type BezierToCubicAbs = typeof BezierToCubicAbs;

export const BezierToCubicRel = 'c';
export type BezierToCubicRel = typeof BezierToCubicRel;

export type BezierToCubic = BezierToCubicAbs | BezierToCubicRel;


export const BezierToSmoothAbs = 'S';
export type BezierToSmoothAbs = typeof BezierToSmoothAbs;

export const BezierToSmoothRel = 's'
export type BezierToSmoothRel = typeof BezierToSmoothRel;

export type BezierToSmooth = BezierToSmoothAbs | BezierToSmoothRel;


export const BezierToQuadraticAbs = 'Q'
export type BezierToQuadraticAbs = typeof BezierToQuadraticAbs;

export const BezierToQuadraticRel = 'q'
export type BezierToQuadraticRel = typeof BezierToQuadraticRel;

export type BezierToQuadratic = BezierToQuadraticAbs | BezierToQuadraticRel;


export const BezierToSmoothQuadraticAbs = 'T'
export type BezierToSmoothQuadraticAbs = typeof BezierToSmoothQuadraticAbs;

export const BezierToSmoothQuadraticRel = 't'
export type BezierToSmoothQuadraticRel = typeof BezierToSmoothQuadraticRel;

export type BezierToSmoothQuadratic = BezierToSmoothQuadraticAbs | BezierToSmoothQuadraticRel;


export const EllipticalArcAbs = 'A'
export type EllipticalArcAbs = typeof EllipticalArcAbs;

export const EllipticalArcRel = 'a'
export type EllipticalArcRel = typeof EllipticalArcRel;

export type EllipticalArc = EllipticalArcAbs | EllipticalArcRel;


export const ClosePath = 'z';
export type ClosePath = typeof ClosePath | 'Z'

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
