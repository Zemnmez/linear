import * as immutable from 'immutable';

export interface Index<K> {
    entries: immutable.Map<K, number>
    slots:  immutable.List<number | undefined>
}

const minusOneAsUndefined =
    <T>(v: T | -1) => v == -1? undefined: v
;

/**
 * Returns an available empty index slot in Index<K>, or
 * adds one and returns it.
 * 
 * **modifies ind !!**
 */
export const getEmptySlot:
    <K>(ind: Pick<Index<K>, 'slots'>) => number
=
    ind => {
        const index = minusOneAsUndefined(ind.slots.findIndex(v => v == undefined))
            ?? ind.slots.size;

        ind.slots = ind.slots.set(index, index );

        return index;
    }
;


export const add:
    <K>(ind: Pick<Index<K>, 'slots' | 'entries'>) =>
    (value: K) => number
=
    ind => k => {
        const n = ind.entries.get(k);
        if (n !== undefined) return n;

        const slot = getEmptySlot(ind)

        ind.entries.set(k, slot);

        return slot;
    }
;

export const has:
    <K>(ind: Pick<Index<K>, 'entries'>) =>
    (value: K) => boolean
=
    ind => value => ind.entries.has(value)
;


/**
 * remove a value from the indexer.
 * @returns true // when the value was deleted
 * @returns false // if nothing needed to be removed
 */
export const remove:
    <K>(ind: Pick<Index<K>, 'slots' | 'entries'>) =>
    (value: K) => boolean
=
    ind => k => {
        const slot = ind.entries.get(k);
        if (slot == undefined) return false;
        ind.entries.delete(k);
        ind.slots = ind.slots.set(slot, undefined)
        return true;
    }
;