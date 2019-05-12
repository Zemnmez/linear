#!/usr/bin/env bash
nvim -s <(echo "
:terminal yarn run react-scripts start
:file server
:vsplit
:terminal yarn run test
:file tests
:split
:terminal make watch
:file make
:tabedit
:e src/components/";
for thing in $@; do
  echo ":vsplit src/components/$thing";
done;
echo ":vsplit tests
G \" so the terminal scrolls")
