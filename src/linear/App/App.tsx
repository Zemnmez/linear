import React from 'react';
import { ErrorBoundary } from 'linear/error';
import './base.css';
import { Home } from 'linear/Home/home';

export const App = () => <ErrorBoundary>
    <Home/>
</ErrorBoundary>
export default App;