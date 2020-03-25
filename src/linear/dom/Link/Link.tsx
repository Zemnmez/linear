import { Link as SafeLink, LinkProps as SafeLinkProps, isLocalLink } from 'linear/dom/safety';
import { LinkIcon as Icon } from './icon';
import React from 'react';
import style from './Link.module.css';

export interface LinkProps extends SafeLinkProps {
    linkIcon?: false
}

export const Link:
    React.FC<LinkProps>
=
    ({ url, children, linkIcon, ...etc }) => {
        const isLocal = url && isLocalLink(url);

        return <SafeLink {...{
            url,
            ...etc
        }}>
            {children}
            {linkIcon==void 0?<Icon {...{
                external: !isLocal,
                visited: false,
                classsName: style.icon
            }}/>:<></>}
        </SafeLink>
    }
;