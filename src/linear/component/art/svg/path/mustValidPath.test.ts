import { mustValidPath } from './path';




describe('mustValidPath', () => {
    it('should prepend m0,0 to paths that dont have it', () => {
        const res = mustValidPath("h10");
        expect(mustValidPath(res).slice(0,'m0,0'.length))
            .toEqual('m0,0');
    });

    it('should not prepend m0,0 to paths that already have it', () => {
        const path = "m0,0h10"
        const res = mustValidPath(path);

        expect(mustValidPath(res)).not.toEqual('m0,0' + path);
    })
})

const renderAnyTable: [Sized<Area>, Area, PathData][] = [
    [{
        path({ h, v }: { width: number, height: number }) {
            return `h${h}v${v}h${-h}z`
        },
        size({ h , v }: { h: number, v: number }) {
            return [h, v]
        },
        props({ color }: { color: string }) {
            return { fill: color }
        }
    }, { width: 10, height: 10}]
]