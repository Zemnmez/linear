import * as t from './';
import React from 'react';
export default { title: "pulldown" }


const Content = React.forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>((props, ref) => <div {...{ref}} {...props} {...{
}}>
    <LongContent/>
</div>);

const LongContent = () => <div {...{
    style: {
        background: "whitesmoke",
        height: "200vh"
    }
}}>
    content!
</div>

const Menu:
    React.FC<JSX.IntrinsicElements["div"]>
=

props => <div {...props}>
    menu!
</div>

export const Example:
    React.FC
= () => <t.PullDown>
    {Menu}

    {Content}

</t.PullDown>