import React from 'react';
import { ErrorBoundary } from 'linear/error';
import './base.css';
import { Home } from 'linear/Home/home';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Pages } from 'linear/routing';
import { RouteMenu } from 'linear/routing/menu';
import style from './app.module.css';

const history = createBrowserHistory();

export const App = () => <ErrorBoundary>
    <Routes/>
</ErrorBoundary>

const Routes = () => <Router history={history}>
    <Pages {...{
        routes: [
            {
                path: "/",
                title: 'home',
                render: () => <Home {...{
                    className: style.page
                }}/>
            }
        ]
    }}>

    <RouteMenu {...{
        className: style.search
    }}/>

    </Pages>
</Router>
export default App;