import React, { useState } from 'react';
import {
  Presentation, Slide, Title
} from './Presentation';

import ReactMarkdown from 'react-markdown';

export default ({ ...etc }) => <Presentation {...{ ...etc }}>
  <div>
    this is slide 1!
  </div>

  <div>
    this is slide 2!
  </div>
</Presentation>
