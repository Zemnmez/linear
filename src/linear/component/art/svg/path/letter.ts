import { L } from "ts-toolbelt";

export type InvertCaseMap = {
    'a': 'A',
    'A': 'a',
    'b': 'B',
    'B': 'b',
    'c': 'C',
    'C': 'c',
    'd': 'D',
    'D': 'd',
    'e': 'E',
    'E': 'e',
    'f': 'F',
    'F': 'f',
    'g': 'G',
    'G': 'g',
    'h': 'H',
    'H': 'h',
    'i': 'I',
    'I': 'i',
    'j': 'J',
    'J': 'j',
    'k': 'K',
    'K': 'k',
    'l': 'L',
    'L': 'l',
    'm': 'M',
    'M': 'm',
    'n': 'N',
    'N': 'n',
    'o': 'O',
    'O': 'o',
    'p': 'P',
    'P': 'p',
    'q': 'Q',
    'Q': 'q',
    'r': 'R',
    'R': 'r',
    's': 'S',
    'S': 's',
    't': 'T',
    'T': 't',
    'u': 'U',
    'U': 'u',
    'v': 'V',
    'V': 'v',
    'w': 'W',
    'W': 'w',
    'x': 'X',
    'X': 'x',
    'y': 'Y',
    'Y': 'y',
    'z': 'Z',
    'Z': 'z',
}

export type Letter = keyof InvertCaseMap;

export type InvertCase<T extends Letter>
    = InvertCaseMap[T]
export const InvertCase =
    <l extends Letter>(l: l): InvertCase<l> =>
        (isUpperCase(l)? ToLowerCase(l): ToUpperCase(l)) as any;

export type LowerCase = 'a'| 'b'| 'c'| 'd'| 'e'| 'f'| 'g'| 'h'| 'i'| 'j'| 'k'| 'l'| 'm'| 'n'| 'o'| 'p'| 'q'| 'r'| 's'| 't'| 'u'| 'v'| 'w'| 'x'| 'y'| 'z';
export const LowerCase: LowerCase[] = [...'abcdefghijklmnopqrstuvwxyz'] as any;
export const isLowerCase =
    (c: string): c is LowerCase => LowerCase.some(l => c == l);

export const UpperCase: UpperCase[] = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'] as any;
export type UpperCase = Exclude<Letter, LowerCase>;
export const isUpperCase =
    (c: string): c is UpperCase => UpperCase.some(l => c == l);

export type ToUpperCase<T extends Letter> =
    T extends LowerCase?
        InvertCaseMap[T]: T;

export const ToUpperCase =
    <L extends Letter>(v: L): ToUpperCase<L> =>
        v.toUpperCase() as any;

export const ToLowerCase =
    <L extends Letter>(v: L): ToLowerCase<L> =>
        v.toLowerCase() as any;

export type ToLowerCase<T extends keyof InvertCaseMap> =
    T extends LowerCase?
        InvertCaseMap[T]: T;