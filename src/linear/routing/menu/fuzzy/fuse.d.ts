// Type definitions for Fuse.js v3.4.6
// TypeScript Version: 3.1

declare module 'fuse.js' {
    export = Fuse;
    export as namespace Fuse;

    interface SearchOpts {
        limit?: number
    }

    declare class Fuse<T, O extends Fuse.FuseOptions<T>> {
        constructor(list: ReadonlyArray<T>, options?: O)
        search<
            /** Type of item of return */
            R = O extends { id: string } ? string : T,
            /** include score (boolean) */
            S = O['includeScore'],
            /** include matches (boolean) */
            M = O['includeMatches'],
            >(pattern: string, opts?: SearchOpts):
            S extends true ? (
                M extends true ?
                (Fuse.FuseResultWithMatches<R> & Fuse.FuseResultWithScore<R>)[] :
                Fuse.FuseResultWithScore<R>[]
            ) : (
                M extends true ?
                Fuse.FuseResultWithMatches<R>[] :
                R[]
            )

        setCollection(list: ReadonlyArray<T>): ReadonlyArray<T>;
    }

    declare namespace Fuse {
        export interface FuseResultWithScore<T> {
            item: T,
            score: number;
        }

        export interface FuseMatch<T> {
            /**
             * indicies at which a match was found
             */
            indicies: [
                /** start */
                number,
                /** end */
                number
            ][],
            /** (if searching array) index of the array, otherwise zero */
            arrayIndex: T extends any[]? number : 0
            /** value of the stringified field */
            value: string,
            /**
             * key in this item (may be a dot-separated path!) */
            key?: string
        }
        export interface FuseResultWithMatches<T> {
            /**
             * The original, unmodified item.
             */
            item: T,

            /**
             * Matches within this item.
             */
            matches: FuseMatch<T>[]
        }
        export interface FuseOptions<T> {
            id?: keyof T | string;
            caseSensitive?: boolean;
            includeMatches?: boolean;
            includeScore?: boolean;
            shouldSort?: boolean;
            sortFn?: (a: { score: number }, b: { score: number }) => number;
            getFn?: (obj: any, path: string) => any;
            keys?: (keyof T | string)[] | { name: keyof T | string; weight: number }[];
            verbose?: boolean;
            tokenize?: boolean;
            tokenSeparator?: RegExp;
            matchAllTokens?: boolean;
            location?: number;
            distance?: number;
            threshold?: number;
            maxPatternLength?: number;
            minMatchCharLength?: number;
            findAllMatches?: boolean;
        }
    }
}
