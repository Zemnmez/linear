import { add } from './indexer';
import { IndexLike, toIndex, fromIndex } from './testutil';

type Test<K extends string | number | symbol> = Parameters<
    (
        name: string,
        initial: IndexLike<K>,
        after: IndexLike<K>,
        returns: number,
        input: K
    ) => never
>;

const testAddMiddle: Test<string> = [
    'add middle',
    { 
        entries: {
            cool: 0,
            cool2: 2
        },
        slots: [0, undefined, 2]
    },
    {
        entries: {
            cool: 0,
            input: 1,
            cool2: 2
        },
        slots: [0, 1, 2]
    },
    1,
    'input'
];

const testAppend: Test<string> = [
    'append',
    {
        entries: {
            cool: 0,
            cool2: 1,
            cool3: 2,
        },

        slots: [0, 1, 2]
    },
    {
        entries: {
            cool: 0,
            cool2: 1,
            cool3: 2,
            cool4: 3
        },
        
        slots: [0, 1, 2, 3]
    },
    3,
    'cool4',
]


describe('add', () => {
    test.each([
        testAddMiddle,
        testAppend
    ])('%# / add / %s', (name, index, after, returns, input) => {
        const myIndex = toIndex(index);
        const ret = add(myIndex)(input);

        expect(ret).toEqual(returns);
        expect(fromIndex(myIndex)).toEqual(after);

    })
})