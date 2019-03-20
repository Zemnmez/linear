import React from 'react';
import Redirect from 'components/Redirect';
import { Route } from 'react-router-dom';
import urlJoin from 'url-join';
import log from '@zemnmez/macros/log.macro';


const Go = ({ }) => <Route {...{
  render: ({ location: {search} }) => {
      log({search});

      if (!search.length) return <Redirect {...{
        to: ".."
      }}/>
      const params = new Map(search
        .slice(1)
        .split("&")
        .map(param => param.split("=")));

      const [dir, file, line] = "dir file line"
        .split(" ")
        .map( s => params.get(s) || "");


      return <Redirect {...{
        to: urlJoin(
          'https://github.com/zemnmez/go/blob/master/',
          dir,
          file,
          `#L${line}`
        )
      }}/>
    }
}}/>


export default Go;
