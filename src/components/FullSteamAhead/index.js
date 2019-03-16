import React  from 'react';
import style from './FullSteamAhead.module.css';
import Markdown from 'react-markdown';
import {
  Presentation, TitleGroup,
  Notes, SlideIndex,
  BackgroundYoutube
} from './Presentation';

import ReactMarkdown from 'react-markdown';

export default ({ ...etc }) => <Presentation {...{ ...etc }}>
  <div>
    <TitleGroup>
      <h1>Full Steam Ahead: RCE in Modern Desktop Applications</h1>
      <h2>Thomas "zemnmez" Shadwell</h2>
      <h3>Infiltrate 2019</h3>
    </TitleGroup>

  <Notes>
  hello everyone! I heard this was an offensive convention so I wanted to start by saying 'fuck'.
  this talk is about modern web & desktop application design, its pros, its cons and its
pitfalls at least partially by example. I'll demonstrate techniques that result in serious
compromise or remote code execution.


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

  <div className={style.oneEyedMan}>
    <h1><SlideIndex/>: The One Eyed Man </h1>

    <div className={style.text}>
      <Markdown {...{source: `
* There's a surprising amount of fear and disdain for
new technologies in information security
* Much of this, I imagine stems from fear of the unknown
* Let's address that.
      `}}/>
    </div>

    <BackgroundYoutube className={style.video} video={"k6K8Ckzg9bI"}/>

    <Notes>

    </Notes>
  </div>

  <div>
    <h1><SlideIndex/>: How The Fuck Does All This Work</h1>
  </div>
</Presentation>
