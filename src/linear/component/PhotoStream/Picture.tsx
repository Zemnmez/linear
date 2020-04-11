import React from 'react';

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
    ({ images: [small, ...others] }) =>
        <img {...{
            src: small.url,
            srcSet: others.map(({ url, width }) =>
                `${url} ${width}w`).join(", ")
        }}/>
;

export default Picture;