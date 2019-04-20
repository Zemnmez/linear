export const classes = (...classes) =>
  [].concat(classes.filter(v=>v)).join(" ");
