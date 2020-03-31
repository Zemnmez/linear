import * as indexer from './indexer';
import React from 'react';

interface Context {
    index: indexer.Index<string>
}

export const defaultContextValue = {
    index: {
        entries: new Map(),
        slots: []
    }
}

export const Context = React.createContext<Context>(defaultContextValue);

export const useIndexer:
    (key: string | undefined) => number | undefined
=
    key => {
        const ctx = React.useContext(Context);
        const [myIndex, setMyIndex] = React.useState<number>();
        React.useEffect(() => {
            if (!ctx) return;
            if (!key) return;
            setMyIndex(indexer.add(ctx.index)
            (key));

            return () => {
                indexer.remove(ctx.index)(key);
                //setMyIndex(0);
            };
        }, [ ctx, key ]);

        return myIndex;
    }
;

export const useIndex:
    () => indexer.Index<string>
=
    () => React.useContext(Context).index
;