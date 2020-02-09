import * as t from '.';
import * as React from 'react';
import 'linear/App/base.css';

export default { title: 'error' };

export const Fatal_ErrorBox = () =>
    <t.ErrorBox error={new Error("something is awry!")}/>;

export const Described_ErrorBox = () =>
    <t.ErrorBox error={t.AnnotateError('is your internet connected?')(new Error('fuck!!'))}/>

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

    <t.ErrorBoundary>
       <BadComponent/>
    </t.ErrorBoundary>
</>

const BadComponent: React.FC = () => {
    throw Object.assign(
        new Error('oopsie'),
        { human: 'oopsie doopsie!!'}
    )
}