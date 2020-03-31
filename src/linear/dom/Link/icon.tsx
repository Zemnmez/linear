import rectPath, { RectProps } from './art';
import { SelfSizedPathSVG } from 'linear/component/art/svg';
import React from 'react';

export interface LinkIconProps {
    external: boolean
    className?: string
}

const externalProps: RectProps = {
    strokeWidth: 1,
    d: 4,
    fill: 'none'
}

const internalProps: RectProps = {
    strokeWidth: 0,
    d: 1,
    fill: 'black'
}


export const LinkIcon:
    (props: LinkIconProps) => React.ReactElement
=
    ({ className, external }) => {
        const props: RectProps =
            external? externalProps: internalProps;

        return <SelfSizedPathSVG {...{
            generator: rectPath,
            className,
            ...props
        }} />
    }
;