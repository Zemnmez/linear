import Photos from './photos';
import React from 'react';
import Test from 'linear/component/App/test';
import style from './photostream.module.css';

export default { title: "hi!"}

export const test = () => <Test><div {...{
    className: style.PhotoStream
}}>
    <Photos/>
</div></Test>