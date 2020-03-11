import * as defaults from './defaults';
import { Type } from './defaults';
import React from 'react';
import * as knobs from '@storybook/addon-knobs';

export const Knobs:
    <P>(component: React.FC<P>, defaults: defaults.DefaultProps<P>)  => React.FC<{}>
=
    (Component, defaults) => () => <Component {...({
        ...(Object.entries(defaults) as [string, defaults.DefaultProp][]).map(([name, prop]: [string, defaults.DefaultProp]) => {
            if ( prop instanceof Number || typeof prop == "number") {
                const p: defaults.Number = prop as any;
                return [name, knobs.number(
                    name,
                    p,
                    p.range? {
                        range: true,
                        ...p.range
                    }: p.range,
                    prop.groupId
                )]
            }

            if (prop instanceof String || typeof prop == "string") {
                const p: defaults.DefaultProp & string
                    = prop as any;

                    switch (prop.type) {
                        case undefined:
                        case Type.text:
                            return [name, knobs.text(
                                name,
                                p,
                                p.groupId
                            )]
                        case Type.colour:
                            return [name, knobs.color(
                                name,
                                p,
                                p.groupId
                            )]
                        default: throw new Error(
                            `oopsie ${Type[Type.colour]}`
                        );
                    }
            }

            if (prop instanceof Date) {
                const p: defaults._Date = prop;
                return [name, knobs.date(
                    name,
                    p,
                    p.groupId
                )]
            }

            throw new Error(`oopsie ${JSON.stringify(prop)}`);
        }).reduce((o, [k,v]: any) => {o[k] = v; return o}, {} as any)
    } as any)}/>
;