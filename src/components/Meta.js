import React from "react";
import { Helmet } from "react-helmet";
import { TWITTER_HANDLE, SITE_NAME, FIRST_NAME, LAST_NAME, USERNAME, GENDER } from "components/Constants";
import POSTER from "Home/static/ash.jpg"

export const META_TAGS = flatten({
    "go-": {
      "import": "${window.location.host} git ${node.env.REACT_APP_GIT_DOMAIN}",
    "source": "${window.location.host} _ ${window.location.host}/go/src{/dir} ${window.location.host}/go/src{/dir}/{file}"
    },

  "twitter:": {
    "card": "summary",
    "site": TWITTER_HANDLE,
    "creator": TWITTER_HANDLE,
//    "description": "",
    "title": document.title,
    "image": POSTER,
    "image:alt": "an out of focus picture of some leaves"
  },

  "og:": {
    "title": document.title,
    "site_name": SITE_NAME,
    "image": POSTER,
    "type": "profile",
    "profile:": {
      "first_name": FIRST_NAME,
      "last_name": LAST_NAME,
      "username": USERNAME,
      "gender": GENDER
    }
  }

})

const flatten = (map, prefix) => 1

