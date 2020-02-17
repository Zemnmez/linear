import * as React from 'react';
import style from './error.module.css';
import { ElementProperties } from 'linear/util';

type div = JSX.IntrinsicElements["div"];

export interface ErrorBox extends div {
    error: any
}

export const ErrorBox:
    React.FC<ErrorBox>
=
    ({error, ...etc}) => {
        let errorString = error?.human
        errorString = typeof errorString == "string"?
            errorString: undefined;

        return <div {...{
            ...etc,
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

interface ErrorBoundaryClassProps<T extends RequestedProps> {
    childProps: T
    Component: React.FC<T>
}

class ErrorBoundaryClass<T extends RequestedProps>
    extends React.Component<ErrorBoundaryClassProps<T>, { error?: Error }> {

    constructor(props: ErrorBoundaryClassProps<T>) {
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
        return <>
            {this.state.error
                ? <ErrorBox
                    error={this.state.error}
                    className={this.props.childProps.className}
                />

                : ""
            }

            {(!this.state.error)
                ? <this.props.Component
                    {...this.props.childProps}
                />
                : ""
            }
        </>
    }
}

interface RequestedProps {
    className?: ElementProperties<"div">["className"]
}

/**
 * ErrorBoundary is a higher order component
 * which wraps an existing component.
 *
 * If an error occurs, the ErrorBoundary will
 * render itself instead of the component, inheriting
 * the className so as to preserve relevant style
 * parameters (such as grid-areas)
 */
export const ErrorBoundary:
    <T extends RequestedProps>(component: React.FC<T>) =>
    React.FC<T>
=
    component => props => <ErrorBoundaryClass
        Component={component}
        childProps={props}
    />
;

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