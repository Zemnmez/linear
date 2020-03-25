import React from 'react';
import { importMDX } from 'mdx.macro';

const Content = React.lazy(importMDX('./test1.mdx'));

export default Content;