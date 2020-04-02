import { createBrowserHistory } from "history";
import React from 'react';
import { Router } from 'react-router-dom';
import Base from './base';

export const Web:
    React.FC<{}>
=
    ({ children }) => {
        const history = React.useMemo(() => createBrowserHistory(), [])
        return <Base>
            <Router {...{history}}>
                {children}
            </Router>
        </Base>
    }
;

export default Web;