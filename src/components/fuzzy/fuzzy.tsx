import * as React from 'react';
import * as Immutable from 'immutable';

export type SearchFunc = (search: (text: string) => SearchedText) => void;

export type AddFunc = (searchFunc: SearchFunc) => () => void;

export type FuzzyContextProps = {
    add: AddFunc
}

type useFuzzySearchT = (input: string) => [
    React.Provider<FuzzyContextProps>,
    (setSearch: string) => void
]

type regexpEscapeT = (...chr: string[]) => string
const regexpEscape: regexpEscapeT = (...chr) => chr.map(c => `\${c}`).join("");

export const useFuzzySearch: useFuzzySearchT = (defaultSearch: string) => {
    const [ searchables, setSearchables ] = React.useState(Immutable.Map<SearchFunc, boolean>());
    const [ search, setSearch ] = React.useState(defaultSearch);

    const add = React.useCallback<AddFunc>((searchFunc: SearchFunc) => {
        setSearchables(searchables.set(searchFunc, true));
        
        return () => setSearchables(searchables.remove(searchFunc))
    }, [ searchables, setSearchables ]);

    React.useEffect(() => {
        const re = new RegExp(`(.*)${regexpEscape(search)}(.*)`);
        [...searchables.keys()].forEach((searchFunc) =>
            searchFunc(text => {
                const matches: SearchedText = [];

                for (let groups: Array<string> | null | undefined;;) {
                    if ((groups = re.exec(text)) === null) break;
                    const [ /* all */, pre, match, post] = groups;
                    matches.push(
                        {text: pre, matched: false},
                        {text: match, matched: true},
                        {text: post, matched: false}
                    );
                }

                // reset
                re.lastIndex = 0;

                return matches;
            })
       )
    }, [ search ])

    return [
        React.createContext<FuzzyContextProps>({
            add,
        }),

        setSearch,
    ]
}

type setText = (text: string) => void;
type SearchedTextItem = {
    text: string,
    matched: boolean,
}

type SearchedText = Array<SearchedTextItem>;

type useSearchableTextT = (startingText: string) => [
    SearchedText, setText
]

export const useSearchableText: useSearchableTextT = (startingText) => {
    const [text, setText] = React.useState<string>(startingText);
    const { add } = React.useContext(FuzzyContext);
    const getText = React.useCallback(() => text, [text]);

    const [remove, setRemove ] = React.useState<() => void>();

    const [ searchedText, setSearchedText ] = React.useState<Array<SearchedTextItem>>([{
        text: text,
        matched: false
    }]);

    const searchText = React.useCallback<SearchFunc>(() => {
        return [
            text,
            (SearchedText) => setSearchedText(SearchedText)
        ]
    }, [ text, setSearchedText ]);


    React.useEffect(() => {
        if (remove) remove();
        setRemove(add(searchText));
    }, []);

    return [searchedText, setText];
}