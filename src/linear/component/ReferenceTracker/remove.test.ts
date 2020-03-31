import { remove } from './indexer';
import { IndexLike, toIndex, fromIndex } from './testutil';

type Test<K extends string | number | symbol> = Parameters<
    (
        name: string,
        initial: IndexLike<K>,
        after: IndexLike<K>,
        returns: boolean,
        input: K
    ) => never
>;

const removeMiddle: Test<string> = [
    'remove cool1',
    {
        entries: {
            cool0: 0,
            cool1: 1,
            cool2: 2
        },

        slots: [0, 1, 2]
    },
    {
        entries: {
            cool0: 0,
            cool2: 2
        },
        slots: [0, undefined, 2]
    },
    true,
    'cool1'
]

describe('remove', () => {
    test.each([
        removeMiddle
    ])('%# / remove / %s', (name, initial, after, returns, input) => {
        const myIndex = toIndex(initial);
        const ret = remove(myIndex)(input);

        expect(fromIndex(myIndex)).toEqual(after);
        expect(ret).toEqual(returns);
    })
})