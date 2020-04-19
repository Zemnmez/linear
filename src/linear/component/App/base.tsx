import React from 'react';
import { Loading } from 'linear/component/Loading';
import { createStore } from 'redux';


export const Base:
    React.FC<{}>
=
    ({ children }) => <React.Suspense fallback={Loading}>
        {children}
    </React.Suspense>
;

export default Base;