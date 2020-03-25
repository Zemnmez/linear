import React from 'react';
import * as t from '.';
import { mustHTTPURL } from 'linear/dom/safety/Link';

export default { title: 'Link' }

export const Example = () =>
    <t.Link {...{
        to: mustHTTPURL(new URL('https://google.com'))
    }}>
        Google
    </t.Link>