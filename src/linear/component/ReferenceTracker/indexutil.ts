import { Index } from './indexer';
import * as immutable from 'immutable';

export interface IndexLike<K extends string | number | symbol> {
    entries: Record<K, number>
    slots: (number | undefined)[]
}

export const toIndex:
    <K extends string | number | symbol>(i: IndexLike<K>) => Index<K>
=
    ({ entries, slots }) => ({
        entries: new Map(Object.entries(entries)) as any,
        slots: immutable.List(slots)
    })
;


export const fromEntries:
    <K extends string | number | symbol,V>(l: [K,V][]) => Record<K,V>
=
    l => l.reduce(
        (a, [k, v]) => {
            a[k] = v;
            return a;
        }
    ,{} as any)
;

export const fromIndex:
    <K extends string>(i: Index<K>) => IndexLike<K>
=
    ({ entries, slots }) => ({
        entries: fromEntries([...entries.entries()]),
        slots: [...slots]
    })
;




