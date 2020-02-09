import { Video } from 'linear/video';
import * as React from 'react';
import style from './header.module.css';

export type Header = {
    name: string
} & JSX.IntrinsicElements["header"]

export const Header:
    React.FC<Header>
=
    ({ name, ...etc }) => <header {...{
            className: style.Header,
            ...etc
        }}>
        <div {...{
            className: style.name,
        }}>{name}</div>
        <Video {...{
            className: style.Video
        }}/>
    </header>
;