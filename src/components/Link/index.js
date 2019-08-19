import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { classes } from 'lib/classes';
import style from "./link.module.css";
import assert from "@zemnmez/macros/assert.macro";

const hurl = error => { throw new Error(error) };

const parseUrl = url => {
  const anchor = document.createElement('a');
  anchor.href=url;
  return anchor;
}


const Link = ({ to, children, notinline = false, className, ...etc }) => {
  assert(etc.href === undefined);
  className = classes(className, style.link, notinline && style.notinline)
  etc.className = className;
  if (!to) return <a {...etc}>{children}</a>;
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
