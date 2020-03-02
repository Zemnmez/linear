import * as f from './func';
export type MoveToRel = Parameters<f.MoveToRel>;
export type MoveToAbs = Parameters<f.MoveToAbs>;
export type MoveTo = Parameters<f.MoveTo>;
export type LineToRel = Parameters<f.LineToRel>;
export type LineToAbs = Parameters<f.LineToAbs>;
export type LineTo = Parameters<f.LineTo>;
export type LineToHorizAbs = Parameters<f.LineToHorizAbs>;
export type LineToHorizRel = Parameters<f.LineToHorizRel>;
export type LineToHoriz = Parameters<f.LineToHoriz>;
export type LineToVertAbs = Parameters<f.LineToVertAbs>;
export type LineToVert = Parameters<f.LineToVert>;
export type LineToVertRel = Parameters<f.LineToVertRel>;
export type ClosePath = Parameters<f.ClosePath>;

export type Instruction =
    MoveTo | LineTo | LineToHoriz |
    LineToVert | ClosePath;

export type ParamsOf<v extends Command> =
    Instruction & { 0: v }