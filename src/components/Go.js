import React from 'react';
import Redirect from 'components/Redirect';
import { Switch, Route } from 'react-router-dom';
import urlJoin from 'url-join';
import log from '@zemnmez/macros/log.macro';


const Src = ({ match: { path } }) => <Route {...{
  path: path + "/:path*",
  render: ({ location: { hash }, match: { params: { path } } }) => {
      return <Redirect {...{
        to: urlJoin(
          'https://github.com/zemnmez/go/blob/master/',
          path,
          hash
        )
      }}/>
    }
}}/>


const Doc = ({ match: { path } }) => <Route {...{
  path: path + "/:path*",
  render: ({ location: { hash }, match: { params: { path } } }) => {
      return <Redirect {...{
        to: urlJoin(
          'https://godoc.org',
          path,
          hash
        )
      }}/>
    }
}}/>



const Go = ({ match: { path: rootPath }, ...etc }) => <Switch>
  <Route {...{
    path: rootPath + "/src",
    render: ({ ...etc2 }) => <Src {...{
      ...etc,
      ...etc2
    }}/>
  }}/>

  <Route {...{
    path: rootPath + "/doc",
    render: ({ ...etc2 }) => <Doc {...{
      ...etc,
      ...etc2
    }}/>
  }}/>

  <Route {...{
    path: rootPath + "/:path*",
    render: ({ location: { hash }, match: { params: { path } } }) =>
      <Redirect {...{
        to: urlJoin(
          rootPath,
          "doc",
          document.location.hostname,
          path || ""
        )
      } } />
  }}/>
</Switch>



export default Go;
