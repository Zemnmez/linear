import raw from 'raw.macro';
import ReactMarkdown from 'react-markdown';
import React from 'react';

export const Steam = () => <ReactMarkdown source={raw("./steam.md")}/>
export default Steam;