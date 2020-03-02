import { L } from 'ts-toolbelt';
export type Point3d = Parameters<
    (X: number, Y: number, Z: number) => never
>;
export type Point2d = L.Drop<Point3d, '2', '<-'>;
export type Point1d = L.Drop<Point3d, '1', '<-'>;

export type Vec3d = Parameters<
    (dx: Point3d[0], dy: Point3d[1], dz: Point3d[2]) => never
>

export type Vec2d = L.Drop<Vec3d, '2', '<-'>;
export type Vec1d = L.Drop<Vec3d, '1', '<-'>;

export type X = L.Drop<Point3d, '1', '<-'>;
export type XY = L.Drop<Point3d, '2', '<-'>;
export type XYZ = L.Drop<Point3d, '3', '<-'>;
export type YZ = L.Drop<XYZ, '1', '->'>;
export type Y = L.Drop<XY, '1', '<-'>;

export type DX = L.Drop<Vec3d, '1', '<-'>;
export type DXDY = L.Drop<Vec3d, '2', '<-'>;

export interface HorizontalLine extends DXDY {
    0: number,
    1: 0,
}

export const isHorizontalLine =
    <A extends number, B extends number>(v: [A,B]): v is [A,B] & HorizontalLine =>
        v[1] == 0;

export interface VerticalLine extends DXDY {
    0: 0,
    1: number
}

export const isVerticalLine =
    <A extends number, B extends number>(v: [A,B]): v is [A,B] & VerticalLine =>
        v[0] == 0;
