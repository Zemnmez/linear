import * as path from './path_primitives';
import React from 'react';

export interface PathProps extends Omit<React.SVGProps<SVGPathElement>, 'd'> {
    d: path.IPath
}

export const Path:
    React.FC<PathProps>
=

    ({d, ...etc}) => <path {...{
        d: path.IPath.stringify(d),
        ...etc
    }}/>
;