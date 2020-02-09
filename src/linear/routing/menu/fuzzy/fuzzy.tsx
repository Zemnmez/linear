import * as React from 'react';
import fuse, { FuseOptions, FuseResultWithScore, FuseResultWithMatches } from 'fuse.js';


export type FuzzyContext = {
    search: string,
}

const FuzzyContext = React.createContext<FuzzyContext|undefined>(undefined);

export type BoundSearchable =
    <T, A extends Array<T> = T[]>(
        v: A,
        options: fuse.FuseOptions<T>
    ) => T[] | FuseResultWithMatches<T>[] |
    FuseResultWithScore<T>[];

export const Searchable =
    <A extends T[], T, opts extends fuse.FuseOptions<T>>(
        v: A,
        options: opts
    ) => {
        const cntx = React.useContext(FuzzyContext);

        const search = cntx?.search ?? "";

        const searcher = React.useMemo(
            () => {
                return new fuse(v, options)
            }
        , [v, options]);


        const results = React.useMemo(
            () => {
                return searcher.search<string>(search)
            }
        , [search, searcher]);



        return results;
    }
;

export type ProviderProps = React.PropsWithChildren<{
    search: string,
}>

export const Search:
    React.FC<ProviderProps>
=
    ({ search, children }) => {
        return <FuzzyContext.Provider value={{search}}>
            {children}
        </FuzzyContext.Provider>
    }