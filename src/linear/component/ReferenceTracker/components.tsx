import React from 'react';
import { Context, useIndexer, useIndex, defaultContextValue } from './hooks'
import style from './components.module.css';
import { Link as NormalLink, LinkProps as NormalLinkProps } from 'linear/dom/Link';

export const Section:
    React.FC
=
    ({ children }) => <Context.Provider value={defaultContextValue}>
        {children}
    </Context.Provider>
;

export const Footnote:
    () => React.ReactElement
=
    () => {
        const index = useIndex();

        return <div {...{
            className: style.Footnote
        }}>
            {[...index.entries.entries()].map(
                ([url, number]) => <React.Fragment key={url}>{number}: {url}</React.Fragment>
            )}
        </div>
    }
;

export interface LinkProps extends NormalLinkProps {}


export const Link:
    (props: LinkProps) => React.ReactElement
=
    ({ url, children, ...props }) => {
        const urlString = url? (
            url instanceof URL?
                url.toString(): url
        ): undefined;
        const index = useIndexer(urlString);

        return <NormalLink {...{
            url,
            ...props
        }}>
            {children}
            {index!==undefined?<sup>{index+1}</sup>:<></>}
        </NormalLink>
    }
;
