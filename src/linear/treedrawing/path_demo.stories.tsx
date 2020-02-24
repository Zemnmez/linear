import { Path } from './path';
import { Path as path, Command } from './path_primitives';
import React from 'react';
export default { title: __filename }

export const example = () => <svg>
    <Path
        d={
            path.New()
                .append(Command.Absolute.Move, 0, 0)
                .append(Command.Relative.Line, 10,10)
        }
    />
</svg>