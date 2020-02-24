import * as React from 'react';
import router from 'react-router-dom';
import { Route as Route_ } from 'react-router-dom';

const Test:
    React.FC<JSX.IntrinsicElements["div"]>
= props => <div {...props}>test</div>;

const Home = React.lazy(() => import('linear/routes/Home'))
const SteamXX = React.lazy(() => import("linear/routes/posts/disclosures/steam"))



type MaybeLazy<T extends React.FC<any>>
    = React.LazyExoticComponent<T> | T;


export interface SuggestedProps<R extends HTMLElement = HTMLElement> {
    className?: string;
    ref?: React.Ref<R>
}

export type RouteComponent<P extends SuggestedProps<R>, R extends HTMLElement> =
    MaybeLazy<(React.RefForwardingComponent<P>) | React.FC<P>>

interface _Route<P extends SuggestedProps<R>, R extends HTMLElement> extends Omit<router.RouteProps, 'render'> {
    render: RouteComponent<P, R>,
    title: string,
    path: string
}

export interface Route extends _Route<SuggestedProps<HTMLElement>, HTMLElement> {}


export interface RouteProps extends Route {
    className?: string
}

export const Route:
    React.FC<RouteProps>
=
    ({render: Render, className, ...props}) => <Route_ {...{
        render: () => <Render className={className}/>,
        ...props
    }}/>
;

export const routes:
    Route[]
= [
    {
        path: "/",
        title: 'home',
        render: Home
    },

    {
        path: "/posts/disclosures/steam",
        title: "steam stuff",
        render: SteamXX
    }

];