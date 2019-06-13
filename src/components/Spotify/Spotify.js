import React from 'react';
import style from "./Spotify.module.css";
import { classes } from "classes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight as signInIcon } from '@fortawesome/free-solid-svg-icons'
import { faSpotify as spotifyIcon } from "@fortawesome/free-brands-svg-icons";
import { Route } from 'react-router-dom';
import { Map } from 'immutable';
import Storage from 'components/Storage';

const localStorageKey = "spotify-oauth-tokens";

const SpotifyContext = React.createContext({ });

class SpotifyProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { tokens: new Map() }
    this.Token = this.Token.bind(this);
  }

  static tokenKey(...scopes) { return scopes.join(",") }

  Token({ scopes, children }) {
    const key = SpotifyProvider.tokenKey(scopes);
    if (this.state.tokens.has(key))
      return children({ token: this.state.tokens.get(key)});

    // and get the token

    return "";
  }

  getToken({ withScopes: [ ...scopes ] }) {
    if (!this.state.tokens.has(SpotifyProvider.tokenKey(scopes))) {

    }
  }

  render() {
    const { children } = this.props;
    const { Token } = this;
    return <Storage {...{
      name: "spotify",
      values: { tokens }
    }}>
      {({ tokens }) => <SpotifyContext.Provider {...{
        value: { Token }
      }}>
        {children}
      </SpotifyContext.Provider>}
    </Storage>
  }
}


const SpotifyProvider = ({
  location = { path: "" },
  redirectPath,
  client_id,
  children
}) => {
  const [tokens, setTokens] = React.useState(new Map());
}

const SpotifyToken = ({
  scopes = [],
  children
}) => <SpotifyContext.Consumer>
  {({ Token }) => <Token {...{
    scopes
  }}>{
    ({ token }) => children({token})
  }</Token>}
</SpotifyContext.Consumer>

/*
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

*/


export default Spotify;
