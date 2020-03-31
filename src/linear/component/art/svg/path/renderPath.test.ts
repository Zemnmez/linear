import * as path from './path';

interface Props {
    color: string
    h: number, v: number
}

const square: path.Path<Props> = {
    path({ h, v }) {
        return `h${h}v${v}h${-h}z`;
    },
    size({ h, v }) {
        return [h, v]
    },
    props({ color: fill }) {
        return { fill }
    }
}

const table:
    [ path.Path<any>, any, ReturnType<typeof path.Render> ][]
= [
    [square, { h: 10, v: 20, color: "red" }, {
        path: "m0,0h10v20h-10z",
        props: { fill: "red" },
        width: 10,
        height: 20
    }]
]

test.each(table)('%#', (gen, props, output) => {
    expect(path.Render(gen, props)).toEqual(output)
})