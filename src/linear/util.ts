
export type Upgrade<T1, T2> =
    Omit<T1, keyof T2> & T2

export const assertInvalidNever:
    (what: string) =>
    (v: never) => void
=
    what => v =>
        { throw new Error(`invalid ${what} ${v}`) };