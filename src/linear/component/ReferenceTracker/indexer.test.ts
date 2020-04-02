import { getEmptySlot } from './indexer';
import { toIndex, fromIndex } from './indexutil';

describe('getEmptySlot', () => {
    test.each([
        [[], [0], 0],
        [[0, 1], [0, 1, 2], 2],
        [[0, undefined, 2], [0, 1, 2], 1]
    ])('getEmptySlot(%p) => (%p) %p', (inA, expectA, expectN) => {
        const ourIndex = toIndex({
            entries: {
                ok: 0
            },
            slots: inA,
        })

        let n = getEmptySlot(ourIndex);

        expect(n).toEqual(expectN);
        expect(fromIndex(ourIndex).slots).toEqual(expectA);
    })
})
