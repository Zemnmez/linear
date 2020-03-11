import * as knobs from '@storybook/addon-knobs';
import { T } from "ts-toolbelt";

export enum Type {
    text,
    boolean,
    number,
    colour,
    color = colour,
    select,
    radio,
    files,
    object,
    array,
    date
}

export interface IPropSettings {
    type?: Type,
    groupId?: string
    value: unknown
}

export type DefaultProps<T> = {
    [K in keyof T] -?: T[K] & DefaultProp
}


type ValueOf<T extends IPropSettings> =
    Omit<T, 'value'> & T["value"];

export type Text = ValueOf<TextSettings>;
export interface TextSettings extends IPropSettings {
    type?: Type.text
    value: string | undefined
}


export type Boolean = ValueOf<BooleanSettings>
export interface BooleanSettings extends IPropSettings {
    type?: Type.boolean,
    value: boolean
}

export type Number = ValueOf<NumberSettings>
export interface NumberSettings extends IPropSettings {
    type?: Type.number,
    value: number,
    range?: {
        min: number,
        max: number,
        step: number
    }
}


export type Color = ValueOf<ColourSettings>;
export interface ColourSettings extends IPropSettings {
    type: Type.colour,
    value: string
}

export type Object = ValueOf<ObjectSettings>;
export interface ObjectSettings extends IPropSettings {
    type: Type.object,
    value: object
}

export type Array = ValueOf<ArraySettings>;
export interface ArraySettings extends IPropSettings {
    type?: Type.array,
    value: string[]
}

export type Select = ValueOf<SelectSettings>;
export interface SelectSettings extends IPropSettings {
    type: Type.select,
    value: string | string[] | object[]
    options: Record<string, string | string[] | object[]>
}

export type Radio = ValueOf<RadioSettings>;
export interface RadioSettings extends Omit<SelectSettings, 'type'> {
    type: Type.radio,
}

export type Files = ValueOf<FilesSettings>;
export interface FilesSettings extends IPropSettings {
    type: Type.files,
    accept: string,
    value: string[],
}

export type _Date = ValueOf<DateSettings>;
export interface DateSettings extends IPropSettings {
    type?: Type.date,
    value: Date,
}

export type DefaultProp = Files | _Date | Radio | Select | Array | Color | Number | Boolean | Text;