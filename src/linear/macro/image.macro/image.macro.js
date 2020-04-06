"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_plugin_macros_1 = __importDefault(require("babel-plugin-macros"));
const path_1 = __importDefault(require("path"));
const do_sync_1 = require("do-sync");
const resize = do_sync_1.doSync(async (target, { width, height, ...jpegOpions }) => {
    const sharp = require('sharp');
    const blob = (await sharp(target)
        .resize(width, height)
        .jpeg(jpegOpions)
        .toBuffer()).toString('base64');
    return { blob, width, height };
});
const image = ({ babel, references, state }) => {
    const [f, ...etc] = Object.values(references);
    const refs = f.concat(...etc);
    for (let ref of refs)
        handleRef({ babel, ref, state });
};
const isNotUndefined = (v) => v !== undefined;
const extractValue = v => {
    switch (v.type) {
        case "StringLiteral":
            return v.value;
        case "BooleanLiteral":
            return v.value;
        case "NumericLiteral":
            return v.value;
        case "ObjectExpression":
            return v.properties.map(prop => {
                switch (prop.type) {
                    case "ObjectMethod":
                        throw new babel_plugin_macros_1.default.MacroError("cannot deserialize object method");
                    case "SpreadElement":
                        throw new babel_plugin_macros_1.default.MacroError("spread not allowed");
                    case "ObjectProperty":
                        if (!prop.key)
                            return undefined;
                        return [prop.key, extractValue(prop.value)];
                    default:
                        throw new babel_plugin_macros_1.default.MacroError("dont know how to handle " + prop.type);
                }
            }).filter(isNotUndefined).reduce((a, [k, v]) => {
                if (!("name" in k))
                    throw new babel_plugin_macros_1.default.MacroError("not sure how to handle " + k.type);
                a[k.name] = v;
                return a;
            }, {});
        default:
            throw new Error("cannot deserialise " + v.type);
    }
};
const nulledFields = {
    leadingComments: null,
    innerComments: null,
    trailingComments: null,
    start: null, end: null,
    loc: null
};
const toValue = v => {
    switch (typeof v) {
        case "string":
            const sret = {
                type: "StringLiteral",
                value: v,
                ...nulledFields
            };
            return sret;
        case "number":
            const nret = {
                type: "NumericLiteral",
                value: v,
                ...nulledFields
            };
            return nret;
        case "object":
            if (v == null) {
                const nullret = {
                    type: "NullLiteral",
                    ...nulledFields
                };
                return nullret;
            }
            if (v instanceof Array) {
                const aret = {
                    type: "ArrayExpression",
                    elements: v.map(toValue),
                    ...nulledFields
                };
                return aret;
            }
            const oret = {
                type: "ObjectExpression",
                properties: Object.entries(v).map(([k, v]) => {
                    const ident = {
                        type: "Identifier",
                        name: k,
                        decorators: null,
                        optional: null,
                        typeAnnotation: null,
                        ...nulledFields
                    };
                    const opropRet = {
                        type: "ObjectProperty",
                        key: ident,
                        value: toValue(v),
                        computed: false,
                        shorthand: null,
                        decorators: null,
                        ...nulledFields
                    };
                    return opropRet;
                }),
                ...nulledFields
            };
            return oret;
        case "boolean":
            const boolret = {
                type: "BooleanLiteral",
                value: v,
                ...nulledFields
            };
            return boolret;
        default:
            throw new babel_plugin_macros_1.default.MacroError("dont know how to serialize " + typeof v);
    }
    throw new babel_plugin_macros_1.default.MacroError("this should never happen");
};
const handleRef = ({ babel, ref, state }) => {
    const callSite = ref.parentPath.node;
    if (callSite.type != "CallExpression")
        throw new babel_plugin_macros_1.default.MacroError("must be called");
    const params = callSite.arguments.map(extractValue);
    return main({ babel, ref, state, params });
};
const main = ({ params: [target, { width, height }], ref, state }) => {
    const { file: { opts: { filename } } } = state;
    const targetPath = path_1.default.join(filename, "..", target);
    const ret = toValue(resize(targetPath, { width, height }));
    ref.parentPath.replaceWith(ret);
};
exports.macro = babel_plugin_macros_1.default.createMacro(image);
exports.default = exports.macro;
