import React from 'react';
import { useVisibilityObserver } from 'linear/hook/useVisibilityObserver';
import { pathToFileURL } from 'url';

interface Context {
    path: string[]
}


const Context = React.createContext<Context | undefined>(void 0);


interface SectionProps {
    title: string
    children:
        React.ForwardRefExoticComponent<any>
}

export const Section:
    React.FC<SectionProps>
=
    ({ title, children: Children }) => {
        const { visible, ref } = useVisibilityObserver();
        let { path = [] } = React.useContext(Context) ?? {};

        if (visible) path = [...path, title];

        return <Context.Provider value={{ path }}>
            <Children {...{ref}}/>
        </Context.Provider>;
    }
;
