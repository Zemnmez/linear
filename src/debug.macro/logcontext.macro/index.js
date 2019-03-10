const { createMacro, MacroError } = require('babel-plugin-macros');

const flattenPath(path) => path.type + (path.parent?flattenPath(path.parent):"");

module.exports = createMacro(({ references, state, babel }) =>
  references.forEach(path => path.replaceWith(babel.stringLiteral(flattenPath(path)));
