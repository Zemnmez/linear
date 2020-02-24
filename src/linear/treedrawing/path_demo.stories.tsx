import { Path } from './path';
import * as primitive from './path_primitives';
import React from 'react';
export default { title: __filename }

export const example = () => <svg>
    <Path
        d={
            primitive.Path.New()
                .append('M', 0, 0)
                .append('L', 10,10)
        }
    />
</svg>