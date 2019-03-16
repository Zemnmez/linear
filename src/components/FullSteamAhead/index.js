import React, { useState } from 'react';
import {
  Presentation, TitleGroup,
  Notes
} from './Presentation';

import ReactMarkdown from 'react-markdown';

export default ({ ...etc }) => <Presentation {...{ ...etc }}>
  <div>
    <TitleGroup>
      <h1>Full Steam Ahead: RCE in Modern Desktop Applications</h1>
      <h2>Thomas "zemnmez" Shadwell</h2>
    </TitleGroup>
  </div>

  <div>
    this is slide 2!
  </div>
</Presentation>
