import * as t from './hoc';
export default { title: "fuzzy - HOC" };
import * as React from 'react';

interface Person {
    name: string,
    age: number
    children?: Person[]
}



interface Child extends Person {
    children: undefined;
}
interface Adult extends Person {
    children: Child[]
}

interface Family {
    adults: Adult
}


 const Adult:
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

const Person = t.Fuzzy<Adult>()(Adult, {
    name: true,
    age: true,
    children: {
        name: true
    }
})
