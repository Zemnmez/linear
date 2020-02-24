import React, { Suspense } from 'react';
import { ErrorBoundary } from './node_modules/linear/error';
import './base.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Pages, Page } from './node_modules/linear/routing';
import { RouteMenu } from './node_modules/linear/routing/menu';
import style from './app.module.css';
import { routes } from "./node_modules/linear/routes"
import { ElementProperties } from './node_modules/linear/util';
import classes from './node_modules/linear/dom/classes';
import { PullDown } from './node_modules/linear/PullDown';

const history = createBrowserHistory();

export interface AppProps extends ElementProperties<"div"> {}

const app:
    React.FC
= () =>
        <Suspense fallback={Loading}>
            <Routes/>
        </Suspense>

export const App = ErrorBoundary(app);

const Loading = () => <> loadin </>


const Routes = () => <Router history={history}>
    <Pages {...{
        routes
    }}>
        <PullDown>
            {RouteMenu}

            {Page}
        </PullDown>

    </Pages>
</Router>
export default App;