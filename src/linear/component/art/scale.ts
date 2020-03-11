import assert from '@zemnmez/macros/assert.macro';
import log from '@zemnmez/macros/log.macro';

export interface Scalable<cfg extends object> {
    path(this: Scalable<cfg>, cfg: cfg): string
    size(this: Scalable<cfg>, cfg: cfg): [number, number]
}

/**
 * extract all values ot T
 */
type ValueOf<T> = T[keyof T]

/**
 * Extract properties of T that extend T2
 */
type Filter<T, T2> = Pick<T,ValueOf<{
    [K in keyof T]: T[K] extends T2? K: never
}>>;

/**
 * Scales a path generator such that it is always
 * contained in a box of given width and height.
 */
export const Scale:
    <cfg extends object>(s: Scalable<cfg>, ...keys: (keyof Filter<cfg, number>)[]) =>
    (cfg: cfg & { width: number, height: number }) => string
=
    (s, ...keys) => cfg => {
        const [width, height] = s.size(cfg);
        const { width: tWidth, height: tHeight } = cfg;
        const k = scaleFactor(width, height, tWidth, tHeight);

        log("calculated scale factor: ", k);
        assert(typeof k == "number");

        const copy = {
            ...cfg
        }


        // scale cfg values
        // gotta bypass types bc Filter<> isnt propagated
        for (const key of keys) (copy[key] as any as number) *= k;

        return s.path(copy);
    }
;

const scaleFactor =
    (width: number, height: number, targetWidth: number, targetHeight: number): number =>
    /*
        width * k < targetWidth
        height * k < targetHeight

        at least one:
        width * k = targetWidth (or)
        height * k = targetHeight

        for width * k = targetWidth
        k1 = targetWidth / width
        let u be utility
        u1 = height * k1 - targetHeight

        for height * k = targetHeight
        k2 = targetHeight / height
        u2 = width * k2 - targetWidth
    */
   {

        log("width", width, "height", height, "target width", targetWidth, "target height", targetHeight);
        assert(typeof width == 'number');
        assert(typeof height == 'number');
        assert(typeof targetWidth == 'number');
        assert(typeof targetHeight == 'number');

        const [k1, k2] = [
            targetWidth / width,
            targetHeight / height
        ];

        const [u1, u2] = [
            (height * k1) - targetHeight,
            (width * k2) - targetWidth
        ];

        const scaleFactor = u1 < u2? k1: k2;

        assert((scaleFactor * width) <= targetWidth, scaleFactor * width);
        assert((scaleFactor * height) <= targetHeight, scaleFactor * width);
        assert(typeof scaleFactor == "number");

        return scaleFactor;
    }
