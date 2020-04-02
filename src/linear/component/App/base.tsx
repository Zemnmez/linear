import React from 'react';
import { Loading } from 'linear/component/Loading';

export const Base:
    React.FC<{}>
=
    ({ children }) => <React.Suspense fallback={Loading}>
        {children}
    </React.Suspense>
;

export default Base;