import style from './photostream.module.css';
import Photos from './photos';
import React from 'react';
import classes from 'linear/dom/classes';

export const PhotoStream = ({ className }) => <div {...{
    ...classes(style.PhotoStream, className)
}}>
    <Photos/>
</div>;

export default PhotoStream;