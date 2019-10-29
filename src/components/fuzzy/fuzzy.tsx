import * as React from 'react';
import * as Immutable from 'immutable';

export type FuzzyContextProps = {
    search?: string,
    add: (key: () => void) => {
        setCount: (number) => void,
        remove: () => void
    },
}

export const fuzzyContext = React.createContext<Partial<FuzzyContextProps>>(null)

type regexpEscapeT = (...chr: string[]) => string
const regexpEscape: regexpEscapeT = (...chr) => chr.map(c => `\${c}`).join("");

type FuzzyMatch = {
    text: string,
    match: boolean
}

type useFuzzyParams = { withText?: string, withSearch?: string }
export function useFuzzy(params: useFuzzyParams): {
    count: number,

    Provider:  React.Provider<FuzzyContextProps>,

    searched: Array<FuzzyMatch>,

    search: string
    setSearch: (string) => void,

    setText: (string) => void
    text: Array<FuzzyMatch>,
};

function sizerAsLengther<T extends {length: number}, T2 extends T & {size: number}>(v : T): T2

function sizerAsLengther(v) { return Object.defineProperty(v, 'length', {
    get: function() { return this.size }
})}
    


export function useFuzzy({ withText, withSearch }) {

    const { search: parentSearch, add } = React.useContext(fuzzyContext);
    const [ search, setSearch ] = React.useState( withSearch || parentSearch );


    const [ text, setText ] = React.useState(withText);
    const [ matches, setMatches ] = React.useState<Immutable.List<FuzzyMatch>>();

    React.useEffect(() => {
        const re = new RegExp(`(.*)(${regexpEscape(search)})(.*)`, "gi");
        let newMatches = Immutable.List();
        let groups;
        for (;;) {
            if (!(groups = re.exec(text))) break;
            const [ /* all */, pre, match, post ] = groups;
            newMatches = newMatches.push(
                { text: pre, match: false },
                { text: match, match: true },
                { text: post, match: false }
            )
        }

        setMatches(newMatches);
    }, [ text, search ]);


    // our searched value is set to whatever the caller sets, or whatever is in
    // the context
    React.useEffect(() => (!withSearch) && setSearch(parentSearch), [ parentSearch ])

    const key = React.useCallback(() => {},[])

    const [ remove, setRemove ] = React.useState();
    const [ setCount, setSetCount ] = React.useState();

    React.useEffect(() => setCount(matches.size), [ matches.size ]);

    // registers callback for any node that wants to take a count
    React.useEffect(() => {
        if (remove) remove();
        const { remove: newRemove, setCount: newSetCount } = add(key);
        setRemove(newRemove);
        setSetCount(newSetCount);
    }, [])





    return {
        search, text, setText, setSearch,
        count: matches.size,
    }


}