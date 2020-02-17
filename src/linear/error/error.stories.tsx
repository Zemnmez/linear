import * as t from '.';
import * as React from 'react';
import 'linear/App/base.css';

export default { title: 'error' };


export const Described_ErrorBoundary = () => <>
    <p>
    If a component throws an error which has
    a 'human' property that is a string, it will be used
    as an error message by the error boundary.
    </p>

    <p>
        This allows us to surface meaningful
        errors to our humans when we have them.
    </p>

    <BadComponent/>
</>


const badComponent: React.FC = () => {
    throw Object.assign(
        new Error('oopsie'),
        { human: 'oopsie doopsie!!'}
    )
}


const BadComponent = t.ErrorBoundary(badComponent);