import * as React from 'react';
import * as t from '.';
import { FuseOptions, FuseResultWithMatches, FuseResultWithScore } from 'fuse.js';
import { BoundSearchable } from './fuzzy';
export default { title: 'fuzzy' };

interface Person {
    name: string,
    age: number
}

export const Search = () => {
    const [search, setSearch] = React.useState('');

    const onChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
        , [setSearch]);

    const people = [
        { name: 'john', age: 20 },
        { name: 'miguel', age: 20 },
        { name: 'johnathan', age: 1000 },
        { name: 'lucy', age: -1 }
    ]

    return <>
        <t.Highlight {...{ search }}>
            <input onChange={onChange} />
            {
                people.map(({name, age}) => <>
                    name: <t.Highlighted value={name}/>
                    age: <t.Highlighted value={age}/>
                </>)
            }
        </t.Highlight>
    </>
}

interface ItemsProps {
    searchHook: BoundSearchable,
    people: Person[]
}
