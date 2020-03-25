import * as React from 'react';
import { ErrorBox } from 'linear/component/ErrorBoundary/ErrorBox';
import { Redirect } from 'react-router-dom';

export interface NotFoundProps {
    className?: string,
    dontRedirect?: boolean
}

interface AfterProps {
    milliseconds: number
}

const After:
    React.FC<AfterProps>
=
    ({ milliseconds: after, children }) => {
        const [ready, setReady] = React.useState(false);

        React.useEffect(
            () => {
                const t = setTimeout(() => setReady(true), after);
                return () => clearTimeout(t)
        }, [])

        return <>{ready?children:<></>}</>
    }
;

export const NotFound =
    React.forwardRef<HTMLDivElement, NotFoundProps>(({ dontRedirect, className }, ref) => <ErrorBox {...{
        className,
        ref
    }}>
            There's nothing here! <br/>

            <After milliseconds={3000}>
                {dontRedirect?<></>:<Redirect to="/"/>}
            </After>
    </ErrorBox>
    );
;

export default NotFound;