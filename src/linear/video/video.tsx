import * as React from 'react';
import poster from './ash.jpg';
import video from './ash.mp4';
import style from './video.module.css';
import classes from 'linear/classes';
import { ErrorBoundary } from 'linear/error';

export type Video = {

} &  React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>

export const Video:
    React.FC<Video>
= ({ className, ...etc }) => <ErrorBoundary>
    <video
    {...{
        autoPlay: true,
        loop: true,
        poster: poster,
        playsInline: true,
        className: classes(style.Video, className),
        ...etc
    }}>

        <source src={video} type="video/mp4"/>
    </video>
</ErrorBoundary>