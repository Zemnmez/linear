import * as command from './command';
import { Instruction } from './instruction';
import React from 'react';

interface stringable {
    toString(): string
}

export type Path = Instruction[];
export const Render:
    (p: Path) => string
=
    p => (p.flat(-1) as stringable[]).join(" ")
;


