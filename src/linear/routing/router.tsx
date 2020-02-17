import { RouteProps, Switch, Route } from 'react-router-dom';
import * as React from 'react';

export interface RouteObj extends RouteProps {
    title: string,
    path?: string
}

/** root routeProps */
export type Router = {
    routes: RouteObj[]
}

export type RouteContext = Router;

export const RouteContext = React.createContext<RouteContext | undefined>(undefined);

/**
 * A simple <Switch> based router describing a set of
 * exclusive routes (pages). Its children are rendered
 * in the RouteContext, but outside of the Switch.
 */
export const Pages:
    React.FC<Router>
=
    (routeProps) => <RouteContext.Provider value={routeProps}>
        {routeProps.children}
    </RouteContext.Provider>
;

export const Page:
    React.FC
=
    () => {
        const cntx = React.useContext(RouteContext);
        return <Switch>
            {cntx?.routes.map((r,i) => <Route {...{
                key: i,
                ...r
            }}/>) ?? ""}
        </Switch>
    }
;