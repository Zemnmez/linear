import * as React from 'react';
import * as guard from 'linear/higher/guard';
import { NewSpecificError } from 'linear/error';
import { FuseResultWithMatches } from 'fuse.js';
import { Search, Searchable } from 'linear/routing/menu/fuzzy';
import d3scale from 'd3-scale';

/// <reference path="./fuse.d.ts" />

/**
 * Taking a series of start, end pairs
 * indigating a range over an imaginary
 * array, gives an array indicating how
 * much each number was visited.
 * for
 * @example
 * overlap([0,1]) // => [1, 1]
 * // 0 is visited by one range, 1 is visited
 * // by 2, and 2 is visited by one.
 * overlap([0,1], [1,2]) // => [1, 2, 1]
 * overlap([0, 5], [0,3]) // => [2,2,2,1,1]
 */
const overlap:
    (...v: readonly [number, number][]) => number[]
=
    (...v) => {
        let o: number[] = [];
        for (const [start, end] of v) {
            for (let i = start; i < end; i++) {
                o[i] = (o[i] || 0) + 1
            }
        }

        return o;
    }
;

export interface Pos<
    start extends number = number,
    end extends number = number
> {
    start: start,
    end: end
}

/**
 * safely access an array index that may be undefined
 * needed bc of https://github.com/Microsoft/TypeScript/issues/11122
 */
const get:
    <T, N extends number, A extends T[]>(v: T[], i: N) => A[N] | undefined
=
    (v, i) => v[i]
;

export interface Run<T> extends Pos {
    value: T
}

/**
 * From a sequence of values, returns non-overlapping
 * ranges indicating runs of values.
 */
const run:
    <T>(...values: readonly T[]) => readonly Run<T>[]
=
    (...vals) => {
        type T = (typeof vals)[0];
        type NT = (Pos & { value: T})
        const o: NT[] = [];
        for (let i = 0; i < vals.length; i++) {

            const value = vals[i];

            // if same as last we extend that one
            const target = get(o, i-1)?.value == value?
                i-1: i;

            // this is just so i dont confuse i and idx

            // undefined if its a new value
            const Old: NT | undefined = get(o, target);

            o[target] = {
                // if we already had a start we
                // don't change it
                start: Old?.start ?? i,
                // updates the end value
                end: i,
                value: value
            }

        }
        return o;
    }
;


type ValuesOr<T, T2> = {
    [K in keyof T]: T[K] | T2
}

export interface HighlightError extends Error {
    name: "HighlightError"
}


export const ErrIncludesKeyPaths = NewSpecificError(
    "HighlightError",
    "match includes key paths, which are unsupported"
)

export const ErrNoKey = NewSpecificError(
    "HighlightError",
    "keyless matches on objects are not supported"
)

export interface Depth extends Pos {

}

export type HighlightedString<s extends string = string> = {
    /**
     * text of the highlighted string
     */
    value: string,

    /**
     * A series of values indicating
     * highlights of given 'depth' --
     * that is, how many times the given
     * range (pos) was matched.
     * @example
     * // searching for 'pop'
     * // in 'popop' will give
     * {
     *     depths: [
     *        { pos: [0, 1], depth: 1}, // 'po'
     *        // the middle 'p' is matched
     *        // twice because it is the beginning
     *        // of one matched 'pop' and the end
     *        // of another
     *        { pos: [2, 2], depth: 2}, // 'p'
     *        { pos: [3, 4], depth: 1} // 'op'
     *     ]
     * }
     */
    runs: readonly Run<number>[]
}

const isHighlightedString =
    (v: FuseResultWithMatches<any>): v is FuseResultWithMatches<string> => typeof v.item == "string";

const isValidHighlightedString =
    <s extends string>(v: FuseResultWithMatches<s>): v is FuseHighlightedString<s> =>
    v.matches.length == 1 && v.item == v.matches[0].value &&
    v.matches[0].key == undefined;


const isValidHighlightedObject =
    (v: FuseResultWithMatches<ValidHighlightObject>): v is FuseHighlightedObject<ValidHighlightObject> =>
    v.matches.every(m => m.key != undefined);

export const highlight
=
    (i: FuseResultWithMatches<ValidHighlightObject> | FuseResultWithMatches<string>) => {
        if (isHighlightedString(i)) {
            return highlightString(guard.must(isValidHighlightedString)(i))
        }

        return highlightObject(guard.must(isValidHighlightedObject)(i));
    }
;

export interface ValidHighlightObject extends Record<string,number | string> {
    /** used only to discriminate from 'string' */
    substring: never;
}

interface FuseHighlightedObject<o extends ValidHighlightObject> extends FuseResultWithMatches<o> {
    item: o,
    /** should only be 1 match bc no keys */
    matches: FuseHighlightedObjectMatches<o>[]
}

interface FuseHighlightedObjectMatches<o extends ValidHighlightObject> extends FuseMatch<o> {
    value: string,
    key: string
    arrayIndex: o extends any[]? number: 0
}

export const highlightObject:
    <T extends ValidHighlightObject>(item: FuseHighlightedObject<T>) =>
            ValuesOr<T, HighlightedString> | typeof ErrIncludesKeyPaths
=
    ({ item, matches }) => {
        let o: ValuesOr<typeof item, HighlightedString>
            = item;

        for (const { indicies, value, key } of matches ) {
            // because this shit would be way
            // too complicated otherwise.
            if (key.includes("."))
                return ErrIncludesKeyPaths;

            const overlaps = overlap(...indicies);
            const runs = run(...overlaps);

            o[key as keyof typeof item] =  {
                value, runs
            }
        }

        return o;
    }
;

interface FuseHighlightedString<s extends string = string> extends FuseResultWithMatches<s> {
    item: s,
    /** should only be 1 match bc no keys */
    matches: [FuseHighlightedStringMatches<s>]
}

// idk why i have to do this
type FuseMatch<T> = FuseResultWithMatches<T>["matches"][0]


interface FuseHighlightedStringMatches<value extends string = string> extends FuseMatch<string> {
    value: value,
    key: undefined
    arrayIndex: value extends any[]? number: 0
}

const highlightString:
    <T extends string>(item: FuseHighlightedString<T>) => HighlightedString<T>
=
    ({ item, matches }) => {
        const [match] = matches;
        return {
            value: item,
            runs: run(...overlap(...match.indicies))
        }
    }
;


export type HighlightContext = {
    /**
     * Takes this highlighted item's
     * highest overlap, and returns the
     * highest overall overlap.
     */
    highestOverlap(n: number): number
}

export const HighlightContext =
    React.createContext<HighlightContext | undefined>(undefined);

export type Highlight = {
    search: string
}

export const Highlight:
    React.FC<Highlight>
=
    ({search, children}) => {

        const [highestOverlap, setHighestOverlap] = React.useState<number>(-Infinity);

        // when the search changes, reset
        // highestoverlap
        React.useEffect(() =>
            setHighestOverlap(-Infinity),
            [search]
        );

        const registerHighestOverlap = React.useCallback((n: number) => {
            if (n > highestOverlap)
                setHighestOverlap(n);
            return highestOverlap;
        }, [ highestOverlap ])

        return <HighlightContext.Provider value ={{highestOverlap: registerHighestOverlap}}>
            <Search {...{search}}>
                {children}
            </Search>
        </HighlightContext.Provider>
    }
;

export type HighlightedProps = {
    value: string | number,
    colorScale?: string[]
}

export const Highlighted:
    React.FC<HighlightedProps>
=
    ({ value, colorScale = ["lightgrey", "black"] }) => {
        const [result] = Searchable(
            [value],
            {
                includeMatches: true,
                includeScore: false,
                findAllMatches: true
            }
        )

        const { runs, value: highlightedValue } = highlightString(
            guard.must(isValidHighlightedString)(result)
        );

        const ctx = React.useContext(HighlightContext);
        const setHighestOverlap = ctx?.highestOverlap;

        const highestOverlap = React.useMemo(
            () => {
                if (!setHighestOverlap) return 0;
                return setHighestOverlap(
                    Math.max(...runs.map(v => v.value))
                )
            }
        , [ setHighestOverlap, runs ])

        const scale = React.useMemo(
            () => d3scale.scaleLinear<string>()
                .range(colorScale)
                .domain([0, highestOverlap])
        , [ highestOverlap ])

        return <>
            {
                runs.map(({ start, end, value: overlap }) =>
                    <div {...{
                        style: {
                            color: scale(overlap)
                        }
                    }}>{highlightedValue.slice(start,end)}</div>)
            }
        </>
    }
;