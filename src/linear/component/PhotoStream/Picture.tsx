import React from 'react';
import style from './photostream.module.css';

export interface Image extends Sized {
    url: string
}

export interface Images {
    images: Image[]
}

export interface Sized {
    width: number, height: number
}

export const Picture:
    (i: Images) => React.ReactElement
=
    ({ images: [small, ...others] }) => {
        const [full, setFull] = React.useState(false);

        const clicked = React.useCallback(() => setFull(!full),  [ full ]);

        return <img {...{
            async: true,
            lazy: true,
            src: small.url,
            className: full?style.full:"",
            srcSet: others.map(({ url, width }) =>
                `${url} ${width}w`).join(", "),
            onClick: clicked
        }}/>
    }
;

export default Picture;