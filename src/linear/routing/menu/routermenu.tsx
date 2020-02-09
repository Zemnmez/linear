import { Route, RouteChildrenProps } from 'react-router-dom';
import { RouteContext } from 'linear/routing';
import * as React from 'react';
import { DescribedError, ErrorBoundary } from 'linear/error';
import style from './routermenu.module.css';
import { RouteObj } from 'linear/routing';
import classes from 'linear/classes';
import { Searcher, BoundSearchable } from 'linear/routing/menu/fuzzy';
import { HighlightSearch } from 'linear/routing/menu/fuzzy/highlight'
import { FuseResultWithMatches } from 'fuse.js';

export type RouteMenu = {

} & JSX.IntrinsicElements["div"];

export const RouteMenuImpl:
    React.FC<RouteMenu & RouteChildrenProps>
=
    ({ location, className, ...etc }) => {
        const routeProps = React.useContext(RouteContext);
        if (!routeProps)
            throw DescribedError(
                'RouteMenu has no context',
                'had trouble making the menu :('
            );

        const { routes } = routeProps;

        const [search, setSearch] = React.useState('');
        const onChange = React.useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
        , [setSearch]);

        const { Provider, Searchable } = Searcher();


        return <Provider {...{search}}>
            <div {...{
                className: classes(style.RouterMenu, className),
                ...etc
            }}>

                <input onChange={onChange} value={search} className={style.search} />

                <Routes {...{routes, search: Searchable}} />

            </div>
        </Provider>
    }
;

export interface RoutesProps {
    routes: RouteObj[]
    search: BoundSearchable
}

const routeKeys: (keyof RouteObj)[] = ['path', 'title'];

export const Routes:
    React.FC<RoutesProps>
=
    ({ routes, search }) => {
        const filteredRoutes = search<RouteObj>(routes, {
            keys: routeKeys
        });

        return <>
        {
            (filteredRoutes as Array<RouteObj | FuseResultWithMatches<RouteObj>>).map(
                (r, i) => <DisplayRoute {...r} key={i}/>
            )
        }
        </>
    }
;

export const DisplayRoute:
    React.FC<RouteObj | FuseResultWithMatches<RouteObj>>
=
    p => {

        return <div {...{
            className: style.DisplayRoute
        }}>
            <div className={style.title}>{p.title}</div>
            <div className={style.path}>{p.path}</div>
        </div>
    }
;

export const RouteMenu:
    React.FC<RouteMenu>
=
    (props) => <ErrorBoundary>
        <Route {...{
            render: (renderProps) =>
                <RouteMenuImpl {...{...props,...renderProps}} />
        }}/>
    </ErrorBoundary>