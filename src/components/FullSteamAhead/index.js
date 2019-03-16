import React, { useState } from 'react';
import {
  Presentation, TitleGroup,
  Notes, SlideIndex
} from './Presentation';

import ReactMarkdown from 'react-markdown';

export default ({ ...etc }) => <Presentation {...{ ...etc }}>
  <div>
    <TitleGroup>
      <h1>Full Steam Ahead: RCE in Modern Desktop Applications</h1>
      <h2>Thomas "zemnmez" Shadwell</h2>
    </TitleGroup>

  <Notes>
  hello everyone! I heard this was an offensive convention so I wanted to start by saying 'fuck'.
  this talk is about modern web & desktop application design, its pros, its cons and its
pitfalls at least partially by example. I'll demonstrate techniques that result in serious
compromise or remote code execution.
  </Notes>
  </div>

  <div>
    <h1><SlideIndex/>: The One Eyed Man </h1>
<iframe width="560" height="315" src="https://www.youtube.com/embed/GkikdKF1YdA?loop=1&playlist=GkikdKF1YdA&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

    <Notes>
The dim air is filled with smoke and laughter. An old, one-eyed man
speaks to you from behind an aged beverage.
"back in my day, things were much simpler. more secure. none of this
'react' nonsense or whatever. developers didn't go chasing the
shinest libraries. just used the stuff we knew was good."
And there's the thing: I feel like the perception of these new-fangled
ways to develop applications is one of unknowning and fear.
Here's how I think of it: every design choice comes with a set of secrity
characteristics. You need to know yours.
While it is absolutely true that these newfangled tools are less well-trodden,
they also have the opportunity -- and in the best cases capitalise on this --
to change the security landscape in the most important way: changing the
abstraction to take insecure modes of operation out of the equation
    </Notes>
  </div>
</Presentation>
