import React from 'react';
import { Redirect as RouterRedirect } from 'react-router-dom';

const hurl = (error) => {throw new Error(error)};

const parseUrl = (url) => {
  const anchor = document.createElement('a');
  anchor.href=url;
  return anchor;
}


const Redirect = ({ to, children, ...etc }) => {
  const { pathname, search, hash, origin, protocol, href } = parseUrl(to);
  if (!/^https?:$/.test(protocol))
    hurl(`non-whitelisted protocol ${protocol}`)

  if (window.location.origin == origin)
    return <RouterRedirect {...{
      to: {
        pathname,
        search,
        hash,
        origin,
        children,
        ...etc
      }
    }}/>

  return window.location.href = href, "";
}


export default Redirect
