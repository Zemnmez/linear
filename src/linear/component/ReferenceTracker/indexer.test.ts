import { getEmptySlot } from './indexer';

describe('getEmptySlot', () => {
    test.each([
        [[], [0], 0],
        [[0, 1], [0, 1, 2], 2],
        [[0, undefined, 2], [0, 1, 2], 1]
    ])('getEmptySlot(%p) => (%p) %p', (inA, expectA, expectN) => {
        let n = getEmptySlot({
            slots: inA,
        });

        expect(n).toEqual(expectN);
        expect(inA).toEqual(expectA);
    })
})
