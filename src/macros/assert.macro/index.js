const { createMacro, MacroError } = require('babel-plugin-macros');
const types = require("@babel/types");
const path = require("path");
const generate = require("@babel/generator").default;


const dotdotdot = (limit) => (str) => [...str].slice(0,limit).join("");
const shorten = dotdotdot(30);

const getClassPath = (path) => path.getAncestry().map(v => {
  let out = "";
  switch (v.type) {
    case "ClassDeclaration":
      if (!v.node.id) return "Anonymous";
      out = v.node.id.name;
      break;
    case "ClassMethod":
      if (!v.node.key) return "Anonymous";
      out = v.node.key.name;
      break;
  }

  return shorten(out);
}).filter(v => v).reverse().join(".");

const macro = ({ references, state, babel }) =>
  references.default.forEach(({ parentPath: call }) => {
    if (process.env.NODE_ENV != 'development') return call.replaceWith(types.emptyStatement());
    types.assertCallExpression(call);

    const assertion = call.node.arguments[0];
    const annotations = call.node.arguments.slice(1);

    call.node.arguments = [assertion].concat([
      `${
      path.basename(call.hub.file.opts.filename)
      }:${call.node.loc.start.line}`,
      `${getClassPath(call)}`,
      generate(assertion).code
    ].map(s => types.stringLiteral(s))).concat(annotations);
    call.node.callee = types.memberExpression(..."console.assert".split(".").map(s => types.identifier(s)));
  });

module.exports = createMacro(macro);
