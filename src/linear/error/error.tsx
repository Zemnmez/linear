import * as React from 'react';
import style from './error.module.css';

export type ErrorBox = {
    error: any
}

export const ErrorBox:
    React.FC<ErrorBox>
=
    ({error}) => {
        let errorString = error?.human
        errorString = typeof errorString == "string"?
            errorString: undefined;

        return <div {...{
            className: style.Error,
            children:
                errorString?
                    <div className={style.ErrorString}>
                        {errorString}
                    </div>:<></>
        }}/>
    }
;

export interface HumanError extends Error {
    /** a message for a human to read */
    human: string
}

export const AnnotateError:
    (s: string) => (v: Error) => HumanError
=
    s => v => Object.assign(v, { human: s })
;

export type ErrorBoundaryState = {
    error?: any
}

export const DescribedError:
    (real: string, human: string) => HumanError
=
    (real, human) => Object.assign(new Error(real), {
        human
    });
;

export class ErrorBoundary extends React.Component<
    {},
    { error?: Error }> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error({error, errorInfo});
    }

    static getDerivedStateFromError(error: any) {
        return { error }
    }

    render() {
        if (this.state.error) return <ErrorBox error={this.state.error}/>;

        return this.props.children;
    }
}

export interface SpecificError<
    name extends string, message extends string
> extends Error {
    message: message, name: name
}

export const NewError = <message extends string>(m: message) => new Error(m) as SpecificError<'Error', message>

export const NewSpecificError:
    <name extends string, message extends string>(name: name, message: message) =>
        SpecificError<name, message>
=
    (name, message) => Object.assign(
        NewError(message),
        { name: name }
    )
;