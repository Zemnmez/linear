import React from 'react';
import './base.css';
import { Pages } from "linear/routes";


export interface AppProps {
    className?: string
}



export const App:
    (props: AppProps) => React.ReactElement
=
    ({ className }) =>
            <Pages {...{
            className
        }}/>
;


export default App
