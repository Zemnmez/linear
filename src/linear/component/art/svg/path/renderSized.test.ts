import { Sized, RenderSized, Area } from './path';

interface Props extends Area {
    color: string
}

const square: Sized<Props> = {
    path({ width: h, height: v }) {
        return `h${h}v${v}h${-h}z`;
    },
    props({ color: fill }) {
        return { fill }
    }
}

const table: [ Sized<any>, any, ReturnType<typeof RenderSized> ][] = [
    [square, { width: 10, height: 20, color: "red" }, {
        path: "m0,0h10v20h-10z",
        props: { fill: "red" },
        width: 10,
        height: 20
    }]
]


describe('RenderSized', () => {
    test.each(table)('%# RenderSized()', (gen, props, output) => {
        expect(RenderSized(gen, props)).toEqual(output)
    })
})