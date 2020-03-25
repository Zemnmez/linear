import { scaled, RectProps } from './art';
import { SizedPathSVG } from 'linear/component/art/svg';
import React from 'react';

export interface LinkIconProps {
    visited: boolean
    external: boolean
    className?: string
}

const visitedProps: RectProps = {
    strokeWidth: 1,
    d: 4,
    fill: 'none'
}

const unvisitedProps: RectProps = {
    strokeWidth: 0,
    d: 1,
    fill: 'black'
}


export const LinkIcon:
    (props: LinkIconProps) => React.ReactElement
=
    ({ visited, className }) => {
        const props: RectProps =
            visited? visitedProps: unvisitedProps;

        return <SizedPathSVG {...{
            generator: scaled,
            className,
            ...props
        }} />
    }
;