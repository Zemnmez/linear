export interface Mapping<
    Output,
    InputSet,
    Input extends InputSet,
    > {
        is(i: InputSet): i is Input
        map(v: Input): Output
    }

export interface MapSetConstructor {
    <Output, Input>(): MapSet<Output, Input, never>
}

export interface MapSet<Output, Input, Intermediates> {
    mapping<IS extends Input, I extends IS>(f: Mapping<Output | Intermediates, Input, I>): MapSet<Output, Input, Intermediates | I >,
    exec: Exclude<Input, Intermediates> extends never?
        (i: Input) => Output | IMappingError: any;
}


export interface IMappingError extends Error {
    name: typeof MappingError.name,
    kind: MappingErrorMessage
}

export const enum MappingErrorMessage {
    Nil = "this error should not occur",
    UnexpectedType =
        "unexpectedly got a type which matches no Mappings",
    TooManyOptions =
        "the mapper has multiple successful type guards. this is potentially dangerous as it indicates type selection ambiguity."
}

class MappingError extends Error {
    name = "MappingError";
    kind = MappingErrorMessage.Nil;
    constructor(message: MappingErrorMessage, ...params: any) {
        super([message, ...params].join(" "));
        this.kind = message;
    }
}

class MapSetImpl<
    Output,
    Input,
    Intermediates,
    MappingsT extends Mapping<
        Intermediates | Output,
        Intermediates | Output,
        any>
    > implements MapSet<Output, Input, any> {
    mappings: readonly MappingsT[] = [];
    constructor(v: MappingsT[]) { this.mappings = v}
    mapping<IS extends Input, I extends IS>(
        f: Mapping<Output | Intermediates, Input, I>
    ): MapSetImpl<Output, Input, Intermediates | I, MappingsT | typeof f> {
        return new MapSetImpl<
            Output,Input,
            Intermediates | I,
            MappingsT | typeof f>([...this.mappings, f]);
    }

    exec(i: Input): Output | IMappingError {

    }
}


/*
export const NewMapSet =
    <Output, Input>(isOutput: (v: any) => v is Output): MapSetImpl<Output, Input, any> => ({
        mappings: [],
        mapping<IS extends Input, I extends IS>(
            this: MapSetImpl<Output, Input, never>,
            f: Mapping<Output, Input, I>
        ): MapSet<Output, Input, I> {
            const n = {
                ...this,
                mappings: [...this.mappings, f]
            }
            return n;
        },

        exec: (function(this: any, i: Input): Output | IMappingError {
            let v: any = i;
            while (!isOutput(v)) {
                const choices = this.mappings.filter(f => f.is(v));
                if (choices.length == 0)
                    return new MappingError(MappingErrorMessage.UnexpectedType, v);
                if (choices.length > 1)
                    return new MappingError(MappingErrorMessage.TooManyOptions, v);
                const [choice] = choices;
                v = choice.map(v);
            }

            return v;
            // fuck
        }) as any
    })
; 
*/