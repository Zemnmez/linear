import * as bio from 'linear/bio';
import * as dom from 'linear/dom';
import style from 'linear/component/bio/style';
import React from 'react';

export interface Description extends Pick<bio.Event, 'description'> {
    className: string
}
export type DescriptionProps = Description;
export const Description:
    React.FC<Description>
=
    ({ description, className }) => <div {...{
        ...dom.classes(style.Description, className),
        children: description,
    }}/>
;

export default Description;