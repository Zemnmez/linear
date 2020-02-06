import { Link as RouterLink } from 'react-router-dom';
import { Any } from 'linear/higher/guard';
import * as React from 'react';

export type Link = {
    url: URL & {
        protocol: "http:" | "https:"
    } | undefined,
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const isProtocol =
    <p extends Readonly<string>>(p: p) =>
    Object.assign(
        <T extends Readonly<URL>>(u: T): u is T & {protocol: p} =>
            u.protocol === p,
        { get guardName() { return `${isProtocol.name}(${p})`}}
    )

export const isLinkable =
    Any(isProtocol('http:'))(isProtocol('https:')).guard;

export const Link:
    React.FC<Link>
=
    ({ url, ...etc }) => {
        const urlString = url === undefined?
            "": url.toString();
        if (url && url.origin === window.location.origin)
            return <RouterLink {...{
                to: url.toString(),
                ...etc
            }}/>;


        return <a {...{
            href: urlString,
            ...etc
        }}/>;
    }

;