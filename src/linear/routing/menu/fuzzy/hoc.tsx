import * as React from 'react';
import {A} from 'ts-toolbelt'
import { O } from 'ts-toolbelt';
import { Any } from 'ts-toolbelt';

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
    <Keys extends KeyObject<Props>>(c: React.FC<
        A.Compute<Intersect<Props, Keys, undefined>>
    >, keys: Keys) => React.FC<Props>

=
    (component, keyObject) => {

    }
;

export type SearchableMemberTypes = string | number;

type KeyObject<O> = UnArr<_KeyObject<O>>

type UnArr<O> =
    O extends Array<infer X>
    ? X: (
        O extends object?
        {[K in keyof O]: UnArr<O[K]>}: O
    );

type _KeyObject<O> =
    O extends object
    ? A.Compute<{
        [K in keyof O]:  O[K] extends SearchableMemberTypes?
            (true | undefined) :  _KeyObject<O[K]>
    }>
    :O;

/**
 * make the values of O1 also include T if the key is in O2,
 * recursively.
 */
type Intersect<O1, O2, T> =
    O1 extends object
    ? O2 extends object
    ? A.Compute<{
        [K in keyof O1]:
            O1[K] | (K extends keyof O2?
                T: never
            )

    }>: O1: O1

