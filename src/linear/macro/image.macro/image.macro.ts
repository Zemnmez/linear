import macros from 'babel-plugin-macros';
import path from 'path';
import { doSync, JSONObject, JSONValue } from 'do-sync';
import sharpT from 'sharp'
import * as babylon from '@babel/parser';
import * as types from '@babel/types';
import generator from '@babel/generator';

interface resizeOpts extends sharpT.JpegOptions, JSONObject {
    width: number, height: number
}

interface resizeRet extends JSONObject {
    width: number, height: number, blob: string
}

const resize = doSync(async (target: string, { width, height, ...jpegOpions }: resizeOpts): Promise<resizeRet> => {
    const sharp = require('sharp') as typeof sharpT;
    const blob = 
        (await sharp(target)
            .resize(width, height)
            .jpeg(jpegOpions)
            .toBuffer()).toString('base64');
    return { blob, width, height };
})


const image:
    macros.MacroHandler
=
    ({ babel, references, state }) => {
        const [f, ...etc] = Object.values(references);
        const refs = f.concat(...etc);
        for (let ref of refs) handleRef({ babel, ref, state });
    }
;

type ValueOf<T> = T[keyof T];
type ArrayOf<T extends any[]> =
    T extends (infer K)[]? K: never;

interface HandleRefProps {
    babel: macros.MacroParams["babel"],
    state: macros.MacroParams["state"],
    ref: ArrayOf<ValueOf<macros.References>>
}

const isNotUndefined:
    <T>(v: T | undefined) => v is T
=
    <T>(v:T | undefined): v is T => v !== undefined
;

const extractValue:
    (v: types.Node) => any
=
    v => {
        switch (v.type) {
        case "StringLiteral":
            return v.value;
        case "BooleanLiteral":
            return v.value
        case "NumericLiteral":
            return v.value
        case "ObjectExpression":
            return v.properties.map(prop => {
                switch (prop.type) {
                    case "ObjectMethod":
                        throw new macros.MacroError("cannot deserialize object method");
                    case "SpreadElement":
                        throw new macros.MacroError("spread not allowed")
                    case "ObjectProperty":
                        if (!prop.key) return undefined;
                        return [prop.key, extractValue(prop.value)]
                    default:
                        throw new macros.MacroError("dont know how to handle "+ prop!.type)
                }
            }).filter(isNotUndefined).reduce((a, [k, v]) => {
                if (!("name" in k))
                    throw new macros.MacroError("not sure how to handle "+ k.type)

                a[k.name] = v;
                return a;
            }, {} as any);
        default:
            throw new Error("cannot deserialise " + v.type);
        }
    }
;

const nulledFields = {
    leadingComments: null,
    innerComments: null,
    trailingComments: null,
    start: null, end: null,
    loc: null
}

type AllowedValues =
    types.ObjectExpression |
    types.StringLiteral | 
    types.NumericLiteral |
    types.NullLiteral |
    types.BooleanLiteral |
    types.ArrayExpression

const toValue:
    (v: JSONValue) => AllowedValues
=
    v => {
        switch (typeof v) {
        case "string":
            const sret: types.StringLiteral = {
                type: "StringLiteral",
                value: v,
                ...nulledFields
            }

            return sret;
        case "number":
            const nret: types.NumberLiteral = {
                type: "NumericLiteral",
                value: v,
                ...nulledFields
            }

            return nret;
        case "object":

            if (v == null ) {
                const nullret: types.NullLiteral = {
                    type: "NullLiteral",
                    ...nulledFields
                }

                return nullret;
            } 

            if (v instanceof Array ) {
                const aret: types.ArrayExpression = {
                    type: "ArrayExpression",
                    elements: v.map(toValue),
                    ...nulledFields
                }

                return aret;
            }


            const oret: types.ObjectExpression = {
                type: "ObjectExpression",
                properties: Object.entries(v).map(([k, v]) => {
                    const ident: types.Identifier = {
                        type: "Identifier",
                        name: k,
                        decorators: null,
                        optional: null,
                        typeAnnotation: null,
                        ...nulledFields
                    }
                    const opropRet: types.ObjectProperty = {
                        type: "ObjectProperty",
                        key: ident,
                        value: toValue(v),
                        computed: false,
                        shorthand: null,
                        decorators: null,
                        ...nulledFields
                    }
                    return opropRet
                }),
                ...nulledFields
            }

            return oret;
            case "boolean":
                const boolret: types.BooleanLiteral = {
                    type: "BooleanLiteral",
                    value: v,
                    ...nulledFields
                }

                return boolret;

            default:
                throw new macros.MacroError("dont know how to serialize "+ typeof v)
        }

        throw new macros.MacroError("this should never happen");
    }
;

const handleRef:
    (p: HandleRefProps) => void
=
    ({ babel, ref, state }) => {
        const callSite = ref.parentPath.node;
        if (callSite.type != "CallExpression") throw new macros.MacroError("must be called");

        const params = callSite.arguments.map(extractValue) as any;

        return main({ babel, ref, state, params });
    }
;

interface MainProps extends HandleRefProps {
    params: Params
}

const main:
    (m: MainProps) => void
=
    ({ params: [ target, { width, height } ], ref, state }) => {
        const { file: { opts: { filename}  } } = state;
        const targetPath = path.join(filename, "..", target);
        const ret = toValue(resize(targetPath, { width, height }));

        ref.parentPath.replaceWith(
            ret
        );
    }
;



interface Sized {
    width: number, height: number
}

export interface Props extends Sized, sharpT.JpegOptions { }

export type Params = [string, Props];


export interface Image {
    blob: Blob,
    exif: Object,
    width: number,
    height: number
}


export const macro: (...p: Params) => Image = macros.createMacro(image)
export default macro;