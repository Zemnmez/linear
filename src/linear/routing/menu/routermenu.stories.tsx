import * as React from 'react';
import { Pages } from 'linear/routing';
import { Router } from 'react-router-dom';
import { RouteMenu } from './';
import { createBrowserHistory } from 'history';

export default { title: 'RouterMenu' };

const home = {
    path: "/",
    title: 'home',
    render: () => <>'home!'</>
}

const cv = {
    path: "/cv",
    title: "cv",
    render: () => <>cv!</>
}

const history = createBrowserHistory();
export const Default = () => <>
    <p>
        RouterMenu is a fuzzy search menu
        displaying all routes gleaned from context.
    </p>

    <Router history={history}>

        <Pages {...{
            routes: [home, cv]
        }}>

    
        <RouteMenu/>
        </Pages>

    </Router>
</>