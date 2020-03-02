import * as instruction from './instruction';
import * as command from './command';
import * as vec from './vec';

export interface LineToVert{
    (...i: [command.LineTo, ...vec.VerticalLine[]]):
        instruction.LineToVert
}


const PickX =
    <X,Y,T>(pre: T, v1: [X,Y], ...vn: [X, Y][]): [T, [X], ...[X][]] =>
    [pre, [v1[0]], ...vn.map<[X]>(([X]) => [X])];


const PickY =
    <X,Y,T>(pre: T, v1: [X,Y], ...vn: [X, Y][]): [ T, [Y], ...[Y][]] =>
    [pre, [v1[1]], ...vn.map<[Y]>(([X,Y]) => [Y])];

export const LineToVert:
    LineToVert
=
    (c, l1, ...ln) =>
        PickY(c == 'L'? 'V': 'v', l1, ...ln)
;

export interface LineToHoriz {
    (...i: [command.LineTo, ...vec.HorizontalLine[]]):
        instruction.LineToHoriz
}

export const LineToHoriz:
    LineToHoriz
=
    (c, l1, ...ln) => PickX(c == 'L'? 'h': 'H', l1, ...ln)
;

/*
export const HorizVert =
    (...i: instruction.Instruction): instruction.Instruction => {
        switch (i[0]) {
        case 'l': case 'L':
            const [ cmd, ...params ] = i;
            if (isArr(vec.isHorizontalLine)(params))
                return LineToHoriz(cmd, ...params);
        default: return i;
        }
    }
;



export const isArr=
    <T1, T2 extends T1>(f: (v: T1) => v is T2) =>
    (v: T1[]): v is T2[] => v.every(f);
;

export const optimizeSingleInstruction:
    (...i: instruction.Instruction) => instruction.Instruction
=
    (...i: instruction.Instruction) => {
        i = HorizVert(...i);
    }
;

*/