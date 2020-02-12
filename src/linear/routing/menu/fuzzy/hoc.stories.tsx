import * as t from './hoc';
export default { title: "fuzzy - HOC" };
import * as React from 'react';

interface Person {
    name: string,
    age: number
    children?: Person[]
}

 const _Person:
    React.FC<Partial<Person>>
=
    ({ name, age, children }) => {
        return <>
            {name??""}{age?`, age ${age}`:""}
            {(children ?? []).map(
                (child, i) => <Person {...child} key={i}/>
            )}

        </>
    }
;

const Person = t.Fuzzy(_Person, {
    name: true,
    age: true,
    children: true
})
