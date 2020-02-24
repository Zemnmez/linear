export interface Numberer {
    valueOf(): number
}

export type Vec1<
    X extends Numberer = Numberer
> = Parameters<
    (X: X) => never
>

export type Vec2<
    X extends Numberer = Numberer,
    Y extends Numberer = Numberer
> = Parameters<
    (X: X, Y: Y) => never
>

export type Point<
    X extends Numberer = Numberer,
    Y extends Numberer = Numberer
> = Vec2<X,Y>;

export type Rect<
    X extends Numberer = Numberer,
    Y extends Numberer = Numberer
> = Vec2<X,Y>;

export interface DotProduct {
    (...vec: Vec2): DotProduct
    valueOf(): number
}


export const DotProduct:
    (...a: Vec2) => DotProduct
=
    (x1: Numberer, y1: Numberer) => Object.assign(
        (x2: Numberer, y2: Numberer) => DotProduct(Mul(x1)(x2),  Mul(y1)(y2)),
        {
            valueOf() { return x1.valueOf() + y1.valueOf()}
        }
    )
;

export type Add = {
    (...v: Vec1): Add
    valueOf(): number
}

export const Add:
    (...v: Vec1) => Add
=
    x1 => Object.assign(
        (x2: Vec1[0]) => Add(x1.valueOf() + x2.valueOf()),
        {
            valueOf() { return x1.valueOf() }
        }
    )
;

export type Mul = {
    (...v: Vec1): Mul
    valueOf(): number
}

export const Mul:
    (...v: Vec1) => Mul & { valueOf(): number }
=
    x1 => Object.assign(
        (x2: Vec1[0]) => Mul(x1.valueOf() * x2.valueOf()),
        {
            valueOf() { return x1.valueOf() }
        }
    )
;

export const numbererer:
    (f: (n: number) => number) =>
    (n: Numberer) => number
=
    f => n => f(n.valueOf())
;

export const cos = numbererer(Math.cos);
export const abs = numbererer(Math.abs);
export const acos = numbererer(Math.acos);

export const Abs: {
    (...n: Vec1): Vec1
    (...n: Vec2): Vec2
    (...n: Numberer[]): Numberer[]
}
=
    <T extends Numberer[] | Vec1 | Vec2>(...v: T) => v.map(n => abs(n)) as any as T
;

export type div = {
    (...a: Vec1): div
    valueOf(): number
}


export const div:
    (...a: Vec1) => div
=
    x1 => Object.assign(
        (x2: Vec1[0]) => div(x1.valueOf() / x2.valueOf()),
        {
            valueOf(){ return x1.valueOf() }
        }
    )
;


export const Angle:
        (...v: Vec2) => (...v: Vec2) => number
=
        (...v1) => (...v2) =>
        acos(
            div
                (DotProduct(...v1)(...v2))
                // ---------------------
                (DotProduct(...Abs(...v1)) (...Abs(...v2))
        )
;