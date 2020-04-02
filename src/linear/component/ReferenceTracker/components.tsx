import React from 'react';
import * as hooks from './hooks';
import * as immutable from 'immutable';
import * as indexer from './indexer';
import { toIndex } from './indexutil';
import style from './components.module.css';
import { Link as NormalLink, LinkProps as NormalLinkProps } from 'linear/dom/Link';

export const Section:
    React.FC
=
    ({ children }) => {
        const [index, setIndex] = React.useState<hooks.Index>(toIndex({
            entries: {},
            slots: []
        }));

        React.useEffect(() => console.log("sect", index.entries.size), [index]);

        const declare = React.useCallback((s: string): number => {
            const ret = indexer.add(index)(s);
            setIndex(index);
            return ret;
        }, [ index, setIndex ])

        const remove = React.useCallback((s: string) =>
            indexer.remove(index)(s)
        , [ index, setIndex ]);

        return <hooks.Context.Provider value={{
            declare, remove, value: index
        }}>
            {children}
        </hooks.Context.Provider>
    }
;

interface FootnoteProps {
    n: number,
    url: string
}

const Footnote:
    (props: FootnoteProps) => React.ReactElement
=
    ({ url }) => <li>
        <NormalLink url={url}>{url}</NormalLink>
    </li>
;

export const Footnotes:
    () => React.ReactElement
=
    () => {
        const indEntries = hooks.useIndex()?.value?.entries;
        const [entries, setEntries] = React.useState<immutable.Map<string, number>>();
        React.useEffect(() => setEntries(indEntries), [ indEntries ]);


        return <div {...{
            className: style.Footnote
        }}>
            {entries?<ol>{[...entries.entries()].map(
                ([url, n]) => <Footnote key={n} {...{url, n}}/>
            )}</ol>
            :<></>}
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
        const index = hooks.useIndexer(urlString);

        return <NormalLink {...{
            url,
            ...props
        }}>
            {children}
            {index!==undefined?<sup>{index+1}</sup>:<></>}
        </NormalLink>
    }
;
