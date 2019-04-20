import React from 'react';
import style from "./KitchenSink.module.css";
import Future from "components/Future";
import { classes } from "classes";

const KitchenSink = ({ children, className }) => <div {...{
  className: classes(style.KitchenSink, className)
}}>
   {children}
</div>

export const LeftBar = ({ children, className }) => <div {...{
    className: classes(style.LeftSinkArea, className)
  }}>

  {children}

</div>


const Logo = ({ className }) => <div {...{
    className: classes(style.Logo, className)
  }}>

  <Future {...{
    className: style.Future
  }}/>

</div>

export const TopBar = ({ title, className }) => <React.Fragment>
  <TopSinkArea {...{
    title
  }}/>
  <Logo/>
</React.Fragment>

const TopSinkArea = ({ title, className }) => <div {...{
    className: classes(style.TopSinkArea, className)
  }}>
  <Title>{title}</Title>
</div>

const Title = ({ children, className }) => <div {...{
  className: classes(style.Title, className)
}}>
  {children}
</div>

export const ContentArea = ({ className, children }) => <div {...{
  className: classes(style.ContentArea,className)
}}> {children} </div>

export default KitchenSink;
