import { Route, RouteChildrenProps } from 'react-router-dom';
import { RouteContext } from 'linear/routing';
import * as React from 'react';
import { DescribedError, ErrorBoundary } from 'linear/error';
import style from './routermenu.module.css';
import { RouteObj } from 'linear/routing';
import classes from 'linear/classes';
import { Link, isLinkable } from 'linear/Link';
import fuse from 'fuse.js';
import { must } from 'linear/higher/guard';
import { ElementProperties } from 'linear/util';



export const RouteMenuImpl:
    React.FC<{}>
=
    () => {
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

        return <>
                <input onChange={onChange} value={search} className={style.search} />

                <Routes {...{routes, search: search}} />
            </>
    }
;

export interface RoutesProps {
    routes: RouteObj[]
    search: string
}

export const Routes:
    React.FC<RoutesProps>
=
    ({ routes, search }) => {
        const searcher = React.useMemo(
            () => new fuse (routes, {
                includeMatches: false,
                includeScore: false,
                findAllMatches: true,
                shouldSort: true,
                keys: ["path", "title"]
            })
        , [ routes ]);

        const results = React.useMemo(
            () => search!=""?searcher.search(search): routes
        , [ searcher, search ]);

        return <>
        {
            results.map(
                r => <DisplayRoute {...r} key={r.path}/>
            )
        }
        </>
    }
;

export const DisplayRoute:
    React.FC<RouteObj>
=
    p => {

        return <Link {...{
            className: style.DisplayRoute,
            url: must(isLinkable)(new URL(
                p.path|| "",
                document.location.href
            ))
        }}>
            <div className={style.title}>{p.title}</div>
            <div className={style.path}>{p.path}</div>
        </Link>
    }
;

export interface RouteMenuProps extends ElementProperties<"div"> {}

const routeMenu:
    React.FC<RouteMenuProps>
=
    ({ className, ...etc}) => <div {...{
        className: classes(className, style.RouterMenu)
    }}>
        <RouteMenuImpl/>
    </div>

export const RouteMenu = ErrorBoundary(routeMenu);