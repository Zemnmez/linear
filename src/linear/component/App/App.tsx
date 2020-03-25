import React, { Suspense } from 'react';
import './base.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ErrorBoundary } from 'linear/component/ErrorBoundary';
import { Pages } from "linear/routes";
import { Loading } from 'linear/component/Loading';

const history = createBrowserHistory();

export interface AppProps extends React.HTMLProps<HTMLDivElement> {}

const app:
    React.FC
= () =>
        <Suspense fallback={Loading}>
            <Routes/>
        </Suspense>

export const App = ErrorBoundary(app);


const Routes = () => <Router history={history}>
    <Pages/>
</Router>
export default App;