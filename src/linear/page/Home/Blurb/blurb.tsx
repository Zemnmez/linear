import { Bio } from 'linear/bio';
import React from 'react';

export interface BlurbProps extends Pick<Bio, "who" | "links">, React.HTMLAttributes<HTMLDivElement> {}

export const Blurb:
    React.FC<BlurbProps>
= ({who, links, ...props}) => <div {...props}>
        {who}
</div>