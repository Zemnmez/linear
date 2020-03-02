import { Path } from './path';
import { Instruction } from './instruction';
export const reduce:
    (p: Path) => string
=
    p => p.map(instr => {
        switch (instr[0])
    })
;

type ndPoint = number[];
type genericInstruction = [string, ...[ndPoint][]];

export const instrToString:
    (i: genericInstruction) => string
=
    ([cmd, ...params]) => {
        return `${cmd}${params.map(p => p.join(',')).join(',')}`
    }
;

export const fancyJoin:
    (v: string[], f: (a: string, b: string) => string) => string
=
    (v, f) => {
        let parts: string[] = [];
        for (let i = 0; i < v.length; i += 2) {
            parts.push(
                v[i+1]? f(v[i], v[i+1]): v[i])
        }
        if (parts.length == 1) return parts[0];
        return fancyJoin(parts, f);
    }
;
