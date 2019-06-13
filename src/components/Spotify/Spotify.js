import React from 'react';
import style from "./Spotify.module.css";
import { classes } from "classes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight as signInIcon } from '@fortawesome/free-solid-svg-icons'
import { faSpotify as spotifyIcon } from "@fortawesome/free-brands-svg-icons";
import { Route } from 'react-router-dom';
import { Map } from 'immutable';

const localStorageKey = "spotify-oauth-tokens";

const SpotifyContext = React.createContext({ });

const getStoredTokens = () => {
  const json = localStorage.get(localStorageKey);
  if (!json) return new Map();
  const parsed = json.parse(json);

  // convert object to immutable map
  const out = new Map();
  Object.entries(parsed).forEach(([k, v]) =>
    out.set(k, v));

  return out;
}

const setStoredTokens = (map) => {
  // convert immutable map to object
  const obj = map.entries().reduce((a, [k, v]) =>
    (a[k] = v, a)
  , {})

  localStorage.set(localStorageKey, JSON.stringify(obj));
}

const SpotifyProvider = ({
  location = { path:  "" },
  redirectPath,
  client_id,
  children
}) => {

  const [tokens, setTokens] = useState(
    localStorage.get(localStorageKey)
  )
  return <React.Fragment>
      <SpotifyContext.Provider {...{
      value: {

      }
    }}>
      <Route {...{
        exact: true,
        path: location.path + redirectPath,
        render: () => <SpotifyCallbackHandler/>
      }}/>

      {children}

    </SpotifyContext.Provider>
  </React.Fragment>
}

const SpotifyAuth = ({
  children,
  scopes = []
}) => null;

const SpotifyCallbackHandler = ({

}) => null;

const Spotify = ({
  client_id,
  ForceReauth,
  redirect_uri,
  className,
  scopes=[],
  render,
  token=localStorage.setItem(localStorageKey,
    new Map(window.location.hash.slice(1).split("&").map(s => s.split("=").map(decodeURIComponent))).get("access_token") ||
    localStorage.getItem(localStorageKey)),
  ...etc
}) => <div {...{
  className: classes(className, style.Spotify),
  ...etc
}}>
  {token&&!ForceReauth?
    (render||(()=>null))({ token }):
    <LoginButton {...{
      onClick: () => window.open(
        `https://accounts.spotify.com/authorize?${Object.entries({
          response_type: "token",
          client_id,
          scopes: scopes.join(','),
          redirect_uri
        }).map(([k, v]) =>
          [k, v].map(encodeURIComponent).join("=")).join("&")}`
      )
    }}/>}
</div>

const LoginButton = ({ ClientID, CallbackURI, className, ...etc }) => <div {...{
  className: classes(className, style.LoginButton),
  ...etc
}}>
  <FontAwesomeIcon {...{
    icon: spotifyIcon,
    className: style.SpotifyLogo
  }}/>
  <FontAwesomeIcon {...{
    icon: signInIcon,
    className: style.LoginIcon
  }}/>
</div>


export default Spotify;
