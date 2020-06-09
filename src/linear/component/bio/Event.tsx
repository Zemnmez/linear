import * as bio from 'linear/bio';
import style from 'linear/component/bio/style';
import React from 'react';

import Title from 'linear/component/bio/Title';
import Description from 'linear/component/bio/Description';

export type EventProps = Event;
export type Event = bio.Event;
export const Event:
    React.FC<Event>
=
    ({description, /*tags,*/ title, url, /*priority,*/
        /*duration*/}) => <div {...{
        className: style.Event
    }}>
        {title?<Title {...{title, url}}/>:<></>}
        {description?<Description {...{description}}/>: <></>}
    </div>
;

export default Event;

