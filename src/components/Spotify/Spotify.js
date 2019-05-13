import React from 'react';
import style from "./Spotify.module.css";
import { classes } from "classes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight as signInIcon } from '@fortawesome/free-solid-svg-icons'
import { faSpotify as spotifyIcon } from "@fortawesome/free-brands-svg-icons";

const localStorageKey = "spotify-oauth-token";

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
