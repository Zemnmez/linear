import React, { Suspense } from 'react';
import { ErrorBoundary } from 'linear/error';
import './base.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Pages, Page } from 'linear/routing';
import { RouteMenu } from 'linear/routing/menu';
import style from './app.module.css';
import { routes } from "linear/routes"
import { ElementProperties } from 'linear/util';
import classes from 'linear/classes';
import { PullDown } from 'linear/PullDown';

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