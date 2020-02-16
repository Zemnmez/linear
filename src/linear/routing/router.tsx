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
        <Switch>
            {routeProps.routes.map((params,i) => <Route {...{
                key: i,
                ...params
            }} />)}
        </Switch>
        {routeProps.children}
    </RouteContext.Provider>
;