import React from 'react';
import { App } from 'linear/component/App';
import { Web } from 'linear/component/App/web';
import * as serviceWorker from './serviceWorker';
import { hydrate, render } from "react-dom";

const rootElement = document.getElementById("root");
const Render = <Web><App/></Web>

if (!rootElement) throw new Error("cannot locate root");
if (rootElement.hasChildNodes()) {
  hydrate(Render, rootElement);
} else {
  render(Render, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
