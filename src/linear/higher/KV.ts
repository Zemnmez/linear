export type KV<K extends string, V> = Record<K,V> | Map<K,V>;

export const KV:
    <V>(v: KV<string,V>) =>
        Map<string,V>

=
    <V>(v: KV<string,V>) => v instanceof Map? v : new Map<string,V>(Object.entries(v))
;

export default KV