import { Video } from './node_modules/linear/video';
import * as React from './node_modules/linear/component/Header/node_modules/react';
import style from './header.module.css';
import { ElementProperties } from './node_modules/linear/util';
import { classes } from './node_modules/linear/dom/classes';

export interface Header extends ElementProperties<"header"> {
    name: string
}

export const Header:
    React.FC<Header>
=
    ({ name, className, ...etc }) => <header {...{
            className: classes(className, style.Header),
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