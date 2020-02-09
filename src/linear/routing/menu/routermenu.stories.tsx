import * as React from 'react';
import { Pages } from 'linear/routing';
import { Router } from 'react-router-dom';
import { RouteMenu } from './';
import { createBrowserHistory } from 'history';

export default { title: 'RouterMenu' };

const history = createBrowserHistory();
export const Default = () => <>
    <p>
        RouterMenu is a fuzzy search menu
        displaying all routes gleaned from context.
    </p>

    <Router history={history}>

        <Pages {...{
            routes: [
                {
                    path: "/",
                    title: 'home'
                },
                {
                    path: "/cv",
                    title: 'CV'
                }
            ]
        }}>

    
        <RouteMenu/>
        </Pages>

    </Router>
</>