import { Link as RouterLink } from 'react-router-dom';
import { must } from 'linear/higher/guard';
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
    url?: HTTPURL | string
}

export type LinkProps = Link;

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

export const assertHTTPURL =
        must(isHTTPURL);

export const mustHTTPURL:
        (url: URL | string) => HTTPURL
=
        u =>
            assertHTTPURL(u instanceof URL? u : new URL(u, document.location.href))
;

export const Link:
    React.FC<Link>
=
    ({ url, ...etc }) => {
        const urlString = url === undefined?
            "": url.toString();

        if (url) {
            const u = mustHTTPURL(url);
            if (isLocalLink(u))
                return <RouterLink {...{
                    to: u.pathname,
                    ...etc
                }}/>;
        }

        return <a {...{
            href: urlString,
            ...etc
        }}/>;
    }

;