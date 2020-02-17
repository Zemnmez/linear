import * as React from 'react';
import 'react-router-dom';
import { RouteObj } from 'linear/routing';

const Test:
    React.FC<JSX.IntrinsicElements["div"]>
= props => <div {...props}>test</div>;

const Home = React.lazy(() => import('linear/routes/Home'))

type MaybeLazy<T extends React.FC<any>>
    = React.LazyExoticComponent<T> | T;

interface SuggestedProps {
    className?: JSX.IntrinsicElements["div"]["className"]
}

export interface Route extends RouteObj {
    render: (props: SuggestedProps) => React.ReactElement
}

export const routes = [
    {
        path: "/test",
        title: 'test',
        render: () => Test
    },

    {
        path: "/",
        title: 'home',
        render: () => Home
    },

]

export const routesWithProps:
    (props: SuggestedProps) =>
    RouteObj[]
=
    props => routes.map(
        ({render: Render, ...etc}) => ({
            ...etc,
            render: () =>
                <Render {...props}/>
        })
    )
;
