import * as React from 'react';
import {A} from 'ts-toolbelt';
import fuse from 'fuse.js';
import { findByDisplayValue } from '@testing-library/react';

type WithDefaults<T, T2 extends Partial<T>, omit extends keyof T = never> = Omit<AssignableOptional<{
    [K in keyof T]:
        K extends keyof T2
        ? T2[K] | optionalMark
        : T[K]
}, optionalMark>, omit>;

export const MandatoryOptions = {
    includeMatches: true,
    findAllMatches: true
}

export type Options<T> = A.Compute<
    WithDefaults<
        fuse.FuseOptions<T>,
        typeof MandatoryOptions,
        "keys"
    >
>

/**
 * Fuzzy is a Higher Order Component.
 * It consumes a component and keys that
 * can be searched on that component.
 *
 * For those keys, if they had no match,
 * they are omitted.
 * @param Props the whole input props object, before filtering
 * @param KeyT (optional) a rough Partial<Props> representing
 * keys to be filtered. In this type, the values can be
 * their correct value, or "true".
 * @param Keys (optional) the expected key object type,
 * representing a mapping of expected keys to `true`.
 * @param c the component to operate on
 * @param keys the key object as defined in Keys.
 *
 * @example
 * declare const _Person: React.FC<Partial<Person>>;
 * const Person = t.Fuzzy<Person>(_Person, {
 *  name: true,
 *  age: true,
 *  children: true
 * }) // React.FC<Person>
 */
export const Fuzzy:
    <Props>() =>
    /**
     * @param keys a whitelist (key: true)
     * indicating what to fuzzy search on
     */
    <Keys extends KeyObject<Props>>(
        keys: Keys,
        options?: Options<Props>
    ) =>
    /**
     * @param c a react functional component
     * consuming potentially matched props.
     */
    (c: React.FC<
        A.Compute<InputObject<Props, Keys>>
    >) => React.FC<Props>

=
        () => (keys, options) => component => props => {
            const opts: fuse.FuseOptions<typeof props> = {
                ...options,
                ...MandatoryOptions
            };
            React.useMemo(
                () => fuse
            )
        }
;

interface ArbitraryKeyObject {
    [key: string]: ArbitraryKeyObject | true
}

const paths:
    (o: ArbitraryKeyObject | true) => string[]
=

o => {
    if (o == true) return [];
    return Object.entries(o).map(
        ([k, v]) => 
    )
}


export type SearchableMemberTypes = string | number;

export const MatchSymbol = Symbol('match');

export interface Matched {
    [MatchSymbol]: {
            /**
             * runs is an array of ranges representing how many times
             * a range of the relevant string (value) was matched
             */
            runs: {
                /**
                 * range indicates a substring of `value`.
                 */
                range: [number, number],
                /**
                 * depth is the number of overlapping matches on `range`.
                 */
                depth: number
            }[]

            /**
             * The coerced string of the matched value
             */
            value: string
    }
}


type InputObjectObjectMap<T> =
    AssignableOptional<T, optionalMark>;

type InputObjectRecordMap<PropObject, KeyObject, key extends keyof PropObject> =
    key extends keyof KeyObject
    // specified as true -- should be optional
    ? PropObject[key] extends object
        ? PropObject[key] extends Array<infer A>
            // arrays are 'flattened' in key objects
            // i.e. T { F: {ok: 1}[] } becomes
            // {F: { ok: true }} as a key object,
            // so we need to extract the array type
            // to make it work :)
            //
            // now, for recursive types this means
            // the key object needs to keep defining
            // fields to search all the way down, but
            // this is INTENTIONAL because we need
            // all the fields to search
            // in advance of the search
            ? InputObject<A, KeyObject[key]>
            : InputObject<PropObject[key], KeyObject[key]>
        : (PropObject[key] & Matched) | optionalMark
    : PropObject[key];

type InputObject<Props, Keys> =
    Props extends object
    ? Keys extends object
    ? A.Compute<InputObjectObjectMap<{
        [K in keyof Props]: InputObjectRecordMap<Props, Keys, K>
    }>>: Props: Props;

type optionalMark = {
    __optionalBrand: never
}

type extractIfArray<T, unionT = never> =
    T extends Array<infer P>? P | unionT: T;

type keyObjectRecordMap<T> = T extends SearchableMemberTypes
    ? true | optionalMark
    : T extends undefined
        ? optionalMark
        : KeyObject<extractIfArray<T, optionalMark>> | optionalMark;

type keyObjectObjectMap<T> = AssignableOptional<T, optionalMark>;


type KeyObject<O> =
    O extends object
    ? A.Compute<keyObjectObjectMap<{
        [K in keyof O]:  keyObjectRecordMap<O[K]>
    }>>
    :O;

type M = KeyObject<{
    cool: 1,
    cool2: {
        cool3: {
            cool4: {
                ok: undefined,
                cool5: 1
            }[]
        }
    }
}>

/**
 * Get the keys of the properties to which U can be assigned.
 */
type AssignableKeys<T, U> = {
  [K in keyof T]: U extends T[K] ? K : never
}[keyof T];

/**
 * Get the interface containing only properties to which T2 can be assigned,
 * extracting T2.
 */
type AssignableProperties<T, T2> = {
  [K in AssignableKeys<T, T2>]: Exclude<T[K], T2>
}

/**
 * Get all of the keys except those to which U can be assigned.
 */
type IncompatibleKeys<T, U> = {
  [K in keyof T]: U extends T[K] ? never : K
}[keyof T];

/**
 * Get the interface containing no properties to which T2 can be assigned.
 */
type OmitAssignableProperties<T, T2> = {
  [K in IncompatibleKeys<T, T2>]: T[K]
}

/**
 * Get the interface where all properties are optional.
 */
type Optional<T> = {[K in keyof T]?: T[K]};

/**
 * Get the interface where properties that can be assigned T2 are
 * also optional.
 */
type AssignableOptional<T, T2> = OmitAssignableProperties<T, T2> & Optional<AssignableProperties<T, T2>>;