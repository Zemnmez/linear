import { TimeEye } from 'linear/component/TimeEye';
import { HourglassSVG } from 'linear/component/art/Hourglass';
import classes from 'linear/dom/classes';
import React from 'react';
import style from './WideEyeOrnament.module.css';

export interface WideEyeOrnamentProps {
    className?: string
}

export const WideEyeOrnament:
    React.FC<WideEyeOrnamentProps>
=
    ({ className }) => <div {...{
        ...classes(style.WideEyeOrnament, className)
    }}>
        <TimeEye className={style.TimeEye} />
        <HourglassSVG className={style.HourglassSVG} />
    </div>
;