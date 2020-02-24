import { RouteProps, Switch } from 'react-router-dom';
import { Route } from 'linear/routes';
import * as React from 'react';

export interface RouteObj extends RouteProps {
    title: string,
    path?: string
}

export interface RouteContext {
    routes: Route[]
}


export const RouteContext = React.createContext<RouteContext | undefined>(undefined);

/**
 * A simple <Switch> based router describing a set of
 * exclusive routes (pages). Its children are rendered
 * in the RouteContext, but outside of the Switch.
 */
export const Pages:
    React.FC<RouteContext>
=
    (routeProps) => <RouteContext.Provider value={routeProps}>
        {routeProps.children}
    </RouteContext.Provider>
;

export const Page =
    React.forwardRef((props, ref: React.Ref<HTMLElement>) => {
        const cntx = React.useContext(RouteContext);
        return <Switch>
            {cntx?.routes.map(({ render: Render, ...r }, i) => <Route {...{
                render: () => <Render {...{...props}} ref={ref} />,
                key: i,
                ...r
            }}/>) ?? ""}
        </Switch>
    })
;