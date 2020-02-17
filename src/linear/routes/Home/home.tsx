import { ErrorBoundary, ErrorBoundaryProps } from "linear/error";
import { Timeline } from "linear/timeline";
import { Bio } from 'linear/timeline/bio';
import { Header } from 'linear/header';
import * as React from 'react';


export const Home:
    React.FC<JSX.IntrinsicElements["div"]>
= (props) => <ErrorBoundary {...props}>
    <Header name={Bio.who.handle}/>
    <Timeline {...Bio} />
</ErrorBoundary>