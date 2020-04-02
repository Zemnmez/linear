import * as indexer from './indexer';
import React from 'react';

export interface Index extends indexer.Index<string> {}

export interface Context {
    declare(s: string): number
    remove(s: string): void
    value: Readonly<Index>
}

export const Context = React.createContext<Context | undefined>(undefined);

export const useIndexer:
    (key: string | undefined) => number | undefined
=
    key => {
        const ctx = React.useContext(Context);
        const [myIndex, setMyIndex] = React.useState<number>();
        React.useEffect(() => {
            if (!ctx) return;
            if (!key) return;
            const newIndex = ctx.declare(key);
            if (newIndex != myIndex) setMyIndex(newIndex);

            return () => ctx.remove(key);
        }, [ ctx, key ]);
        
        return myIndex;
    }
;

export const useIndex:
    () => Context | undefined
=
    () => React.useContext(Context)
;