import React from 'react';
import { importMDX } from 'mdx.macro';

export const Content = React.lazy(importMDX('./test1.mdx'));

export default Content;