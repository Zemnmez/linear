import { storiesOf as _storiesOf } from "@storybook/react"


const path_prefixes = new RegExp("^"+process.env.NODE_PATH.split(/[:;]/g).map(
  path => "(?:\./)?" + path
).join("|"), "i");


const stripNodePath = (path) => path.replace(path_prefixes, "");

const path = (s) => s.split(/[\\/]/g).slice(0, -1).join("/")

const makeTidyPath = (s) => path(stripNodePath(s))


export const storiesOf = (module) =>  {
  return _storiesOf(makeTidyPath(module.id), module)
}

