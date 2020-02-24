export const classes = (...s: (string|undefined)[]) => s.filter(s => !!s).join(' ')
export default classes;