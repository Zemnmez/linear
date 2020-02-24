export type Vec2<
    X extends number = number,
    Y extends number = number
> = Parameters<
    (X: X, Y: Y) => never
>

export type Point<
    X extends number = number,
    Y extends number = number
> = Vec2<X,Y>;

export type Rect<
    X extends number = number,
    Y extends number = number
> = Vec2<X,Y>;