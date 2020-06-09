type Outputs<T extends Record<string, any>> = {
    [K in keyof T]: () => T[K]
}


export type Component<fn extends (i: any) => any | void> =
    (props: Props<fn>) => React.ReactElement | null
;

export type Props<fn extends (i: any) => any | void> =
    fn extends (i: infer I) => infer O
        ? I & Outputs<O>
        : never
;

export default Component;