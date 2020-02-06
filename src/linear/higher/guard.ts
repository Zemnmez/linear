export type NamedGuard<I,O extends I, name extends string> = {
    (v: I): v is O,
    guardName?: name
}


export const must:
    <T, IT extends Readonly<T>, OT extends IT, S extends string>(f: NamedGuard<IT, OT, S>) =>
    (v: IT) => OT
=
    f => v => {
        if (!f(v)) throw new Error(
            `type assertion ${f.guardName || f.name} failed on ${v}`
        )
        return v;
    }
;


export const All = <T, I extends Readonly<T>, O extends I, N extends string>(
        f: NamedGuard<I,O,N>
    )=> Object.assign(
        <I2, O2 extends I2, N2 extends string>(
            f2: NamedGuard<I2,O2,N2>
        ) => All(
            Object.assign(
                (v: I & I2): v is O & O2 => f(v) && f2(v),
                { get guardName() {return `${f.name} & ${f2.name}` } }
            ),
        ),
        {
            guard: f,
        }
    )
;


export const Any = <T, I extends Readonly<T>, O extends I, N extends string>(
        f: NamedGuard<I,O,N>
    )=> Object.assign(
        <O2 extends I, N2 extends string>(
            f2: NamedGuard<I,O2,N2>
        ) => Any(
                Object.assign(
                    (v: I): v is O | O2 => f(v) || f2(v),
                    { get guardName() { return `${f.name} || ${f2.name}`}}
                ),
            ),
        {
            guard: f
        }
    )
;