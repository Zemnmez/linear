import { ErrorBoundary } from "linear/error";
import { Timeline } from "linear/timeline";
import { Bio } from 'linear/timeline/bio';
import { Header } from 'linear/header';
import * as React from 'react';


const home:
    React.FC<JSX.IntrinsicElements["div"]>
= (props) => <div {...props}>
    <Header name={Bio.who.handle}/>
    <Timeline {...Bio} />
</div>

export const Home = ErrorBoundary(home);