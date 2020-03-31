import { Link as SafeLink, LinkProps as SafeLinkProps, isLocalLink, mustHTTPURL } from 'linear/dom/safety';
import React from 'react';
import style from './Link.module.css';
import { classes } from 'linear/dom/classes';

export interface LinkProps extends SafeLinkProps {
    linkIcon?: false
}

export const Link:
    React.FC<LinkProps>
=
    ({ url, children, linkIcon, className, ...etc }) => {
        const nurl = url !== undefined? mustHTTPURL(url): url;
        const isLocal = nurl && isLocalLink(nurl);

        return <SafeLink {...{
            url,
            ...!isLocal?{ target: '_blank'}: {},
            ...classes(style.Link, className),
            ...etc
        }}>
            {children}
        </SafeLink>
    }
;