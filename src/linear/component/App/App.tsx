import React, { Suspense } from 'react';
import './base.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Pages, Page, PullDown, RouteMenu, ErrorBoundary } from 'linear/component';
import { routes } from "linear/routes"

const history = createBrowserHistory();

export interface AppProps extends React.HTMLProps<HTMLDivElement> {}

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