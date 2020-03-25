import { Video } from 'linear/page/Home/video';
import * as React from 'react';
import style from './header.module.css';
import { ElementProperties } from 'linear/util';
import { classes } from 'linear/dom/classes';

export interface Header extends ElementProperties<"header"> {
    name: string
}

export type HeaderProps = Header;

export const Header:
    React.FC<Header>
=
    ({ name, className, ...etc }) => <header {...{
            ...classes(className, style.Header),
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