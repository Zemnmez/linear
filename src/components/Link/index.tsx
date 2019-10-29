import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { classes } from 'lib/classes';
import style from "./link.module.css";
import assert from "@zemnmez/macros/assert.macro";

const hurl = (error: string) => { throw new Error(error) };

const parseUrl = (url: string) => {
  const anchor = document.createElement('a');
  anchor.href=url;
  return anchor;
}


const Link: React.FunctionComponent<{
  to?: string,
  className?: string,
}> = ({ to, children, className, ...etc }) => {
  className = classes(className, style.link);
  if (!to) return <a {...{...etc, className}}>{children}</a>;
  let { pathname, search, hash, origin, protocol, href } = parseUrl(to);
  if ( to == undefined ) {
    origin = to;
    to = "";
  }
  if (!/^https?:$/.test(protocol))
    hurl(`non-whitelisted protocol ${protocol}`)

  if (window.location.origin == origin)
    return <RouterLink {...{
      to: {
        pathname,
        search,
        hash,
        origin,
      },
      ...etc
    }}>{children}</RouterLink>

  return <a {...{
    href,
    children,
    ...etc
  }}/>
}


export default Link
