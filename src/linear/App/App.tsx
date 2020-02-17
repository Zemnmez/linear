import React, { Suspense } from 'react';
import { ErrorBoundary } from 'linear/error';
import './base.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Pages } from 'linear/routing';
import { RouteMenu } from 'linear/routing/menu';
import { routesWithProps } from 'linear/routes';
import style from './app.module.css';

const history = createBrowserHistory();

export const App = () =>
    <ErrorBoundary className={style.App}>
        <Suspense fallback={Loading}>
            <Routes/>
        </Suspense>
    </ErrorBoundary>;

const routes = routesWithProps({
    className: style.page
})

const Loading = () => <> loadin </>


const Routes = () => <Router history={history}>
    <Pages {...{
        routes
    }}>

    <RouteMenu {...{
        className: style.search
    }}/>

    </Pages>
</Router>
export default App;