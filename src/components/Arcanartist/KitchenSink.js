import React from 'react';
import style from "./KitchenSink.module.css";
import Future from "components/Future";

const KitchenSink = ({ children, className }) => <div {...{
  className: [style.KitchenSink].concat(className).join(" ")
}}>
  <TopBar/>
  <LeftBar/>
  <ContentArea> {children} </ContentArea>
</div>


export const LeftBar = ({ children, className }) => <div {...{
    className: [style.LeftSinkArea].concat(className).join(" ")
  }}>

  {children}

</div>


const Logo = ({ className }) => <div {...{
    className: [style.Logo].concat(className).join(" ")
  }}>

  <Future {...{
    className: style.Future
  }}/>

</div>

const TopBar = ({ className }) => <React.Fragment>
  <TopSinkArea/>
  <Logo/>
</React.Fragment>

const TopSinkArea = ({ className }) => <div {...{
    className: [style.TopSinkArea].concat(className).join(" ")
  }}/>

const ContentArea = ({ className, children }) => <div {...{
  className: [style.ContentArea].concat(className).join(" ")
}}> {children} </div>

export default KitchenSink;
