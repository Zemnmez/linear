import React from 'react';
import { Bio } from 'linear/timeline/bio';
import { Timeline } from 'linear/timeline';
import { ErrorBoundary } from 'linear/error';
import './base.css';

export const App = () => <ErrorBoundary>
    <Timeline {...Bio}/> </ErrorBoundary>
export default App;