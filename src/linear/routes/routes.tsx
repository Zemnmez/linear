import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

const Test:
    React.FC<JSX.IntrinsicElements["div"]>
= props => <div {...props}>test</div>;

const Home = React.lazy(() => import('linear/page/Home'))
const NotFound = React.lazy(() => import("linear/page/NotFound"));

type SuggestedElement =  HTMLDivElement

type MaybeLazy<T extends React.FC<any>>
    = React.LazyExoticComponent<T> | T;


interface suggestedProps {
    className?: string;
}

export type SuggestedProps = React.RefAttributes<SuggestedElement> & suggestedProps;

export interface PageProps {
    children: React.LazyExoticComponent<
        React.ForwardRefExoticComponent<SuggestedProps>> | React.ForwardRefExoticComponent<SuggestedProps>
    title: string,
    path: string,
    props: SuggestedProps,
    inexact?: true
}

const TitledPage: React.FC<Pick<PageProps, 'title'>> =
    ({ title, children }) => {
        document.title = ["zemnmez", title].join(" / ");

        return <>{children}</>
    }

export const Page = React.forwardRef<HTMLDivElement, PageProps>(
    ({ children: Child, title, path, props, inexact }, ref) =>
        <Route {...{
            path: path,
            exact: !inexact,
        }}>
            <TitledPage title={title}>
                <Child {...{ ref, ...props }}/>
            </TitledPage>
        </Route>
)


export interface PagesProps extends SuggestedProps {
    children?: React.ReactNode
}

export const Pages =
    React.forwardRef<HTMLDivElement, PagesProps>(
        ({ children, ...props }, ref) => {
            const etc = { props, ref };
            return <Switch>
                {children}
    <Page {...{
        path: '/',
        title: 'Home',
        ...etc
    }}>
        {Home}
    </Page>

    <Page {...{
        path: '/',
        title: 'Not Found',
        ...etc
    }}>
        {NotFound}
    </Page>
</Switch>
        }
    )

/*
export const Pages =
        React.forwardRef<HTMLDivElement, PagesProps>(
            ({ className }, ref ) => <Switch>
                <Route {...{
                    path: "/",
                    title: 'home',
                    render: Home,
                    exact: true,
                    props: {
                        className
                    },
                    ref
                }}/>

                <Route {...{
                    path: "/",
                    title: 'Not Found',
                    render: NotFound,
                    exact: true,
                    props: {
                        className
                    },
                    ref
                }}/>
            </Switch>
        )
*/