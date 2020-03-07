import * as ins from './instruction';
import { Path } from './path';
import Command from './command';
export const generic:
    <c extends Command>(cmd: c) =>
    (p: Path, ...args: ins.ParamsOf<c>) =>
    Path
=
    c => (p, ...args) => [...p, [c, ...args]]
;
export const Append:
    (p: Path, ...cmd: ins.Instruction) => Path
=
    (p, ...cmd) => [...p, cmd]
;

export const MoveToRel = ins.ParamsOf<