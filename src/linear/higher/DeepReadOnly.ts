import {Object} from 'ts-toolbelt'
export type DeepReadOnly<T extends {}> =
    Object.Readonly<T, any, "deep">;