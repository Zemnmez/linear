import { Link as RouterLink } from 'react-router-dom';
import { All, Any } from 'linear/higher/guard';
import * as React from 'react';

export interface _LocalLink extends URL {
    _LocalLinkBrand: never
}

const is_LocalLink =
    Object.assign(
        (u: URL): u is _LocalLink =>
        u.origin == window.location.origin,
        { guardName: "isLocalLink"}
    );

export type LocalLink =
        HTTPURL & _LocalLink;

export interface HTTPURL extends URL {
    protocol: "http:" | "https:"
}

export interface Link extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    url?: HTTPURL
}

export const isProtocol =
    <p extends Readonly<string>>(p: p) =>
    Object.assign(
        <T extends Readonly<URL>>(u: T): u is T & {protocol: p} =>
            u.protocol === p,
        { get guardName() { return `${isProtocol.name}(${p})`}}
    )



export const isLocalLink =
    All(
        Any(isProtocol('http:'))(isProtocol('https:')).guard
    )(is_LocalLink).guard;

export const isHTTPURL =
    Any(isProtocol('http:'))(isProtocol('https:')).guard;

export const Link:
    React.FC<Link>
=
    ({ url, ...etc }) => {
        const urlString = url === undefined?
            "": url.toString();
        if (url&&isLocalLink(url))
            return <RouterLink {...{
                to: url.pathname,
                ...etc
            }}/>;


        return <a {...{
            href: urlString,
            ...etc
        }}/>;
    }

;