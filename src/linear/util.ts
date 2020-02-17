
export type Upgrade<T1, T2> =
    Omit<T1, keyof T2> & T2

export const assertInvalidNever:
    (what: string) =>
    (v: never) => asserts v is never
=
    what => (v: never): asserts v is never =>
        { throw InvalidNever(v) };

export const InvalidNever =
    (what: string) => (v: never) =>
        new Error(`Invalid ${what} ${v}`)