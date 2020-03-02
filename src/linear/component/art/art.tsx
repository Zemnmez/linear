import React from 'react';

export const ViewBoxed:
    <P>(C: React.FC<P>, size: (v: P) => [number, number]) =>
    React.FC<P>
=
    (C, size) => p => <svg viewBox={`0 0 ${size(p).join(" ")}`}>
        <C {...p}/>
    </svg>
;