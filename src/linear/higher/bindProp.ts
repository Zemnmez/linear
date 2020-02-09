export const bindProp:
    <T,R,P extends Partial<T>>(v: P, f: (o: T) => R) =>
        (o: Omit<T, keyof P>) => R
=
    (v, f) => o => f({...o, ...v} as any)
;

const f:
    ({ok, cool} : {ok: boolean, cool: string}) => 1
=
    () => 1