import unist from 'unist';
import { Point } from './vec';
import { L, O } from 'ts-toolbelt';

export interface Stringer {
    toString(): string
}

type UpperCaseAlpha = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

type LowerCaseAlpha = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';

type Alpha = UpperCaseAlpha | LowerCaseAlpha;

interface IPathNode extends Array<Stringer> {
    0: Alpha
}

interface IRelativePathNode extends IPathNode {
    0: LowerCaseAlpha
}

interface IAbsolutePathNode extends IPathNode {
    0: UpperCaseAlpha
}

export type MoveNode = Parameters<
    (command: 'm' | 'M' ...pt: Point) => never
>

export type MoveRelativeNode = Parameters<
    (command: 'm', ...pt: Point) => never
>

export type MoveAbsoluteNode = Parameters<
    (command: 'M', ...pt: Point) => never
>

export type LineNode = Parameters<
    (command: 'L' | 'l', X: number, y: number) => never
>

export type AbsoluteLineNode = Parameters<
    (command: 'L', ...pt: Point) => never
>

export type RelativeLineNode = Parameters<
    (command: 'l', ...pt: Point) => never
>

export type HorizontalLineNode = Parameters<
    (command: 'h' | 'H', ...x: [Point[0]]) => never
>

export type RelativeHorizontalLineNode = Parameters<

(command: 'h', ...x: [Point[0]]) => never
>

export type AbsoluteHorizontalLineNode = Parameters<
    (command: 'H', ...x: [Point[0]]) => never
>

export type VerticalLineNode = Parameters<
    (command: 'v' | 'V', ...x: [Point[1]]) => never
>

export type RelativeVerticalLineNode = Parameters<
    (command: 'v', ...x: [Point[1]]) => never
>

export type AbsoluteVerticalLineNode = Parameters<
    (command: 'V', ...x: [Point[1]]) => never
>

export type PathNode =
    MoveRelativeNode | MoveAbsoluteNode |
    RelativeHorizontalLineNode | AbsoluteHorizontalLineNode |
    RelativeLineNode | AbsoluteLineNode |
    RelativeVerticalLineNode | AbsoluteVerticalLineNode;

export type PathCommand = PathNode[0]

export interface IPath extends ReadonlyArray<PathNode> {}

interface PathAppendAPI<R extends IPath = IPath> {
    /** Move the path cursor relative to current positio n*/
    (...a: MoveRelativeNode): R
    /** Move the path cursor to an absolute position */
    (...a: MoveAbsoluteNode): R
    /** Draw a horizontal line and move the path cursor to the relative position */
    (...a: RelativeHorizontalLineNode): R
    /** Draw a horizontal line and move the path cursor to the absolute position */
    (...a: AbsoluteHorizontalLineNode): R
    /** Draw a line relative to the current path position, and move the path cursor there */
    (...a: RelativeLineNode): R
    /** Draw a line to the given absolute path position, and move the path cursor there */
    (...a: AbsoluteLineNode): R
    /** Draw a vertical line relative to the current path position, and move the path cursr there */
    (...a: RelativeVerticalLineNode): R
    /** Draw a vertical line to the given absolute path position, and move the path cursor there */
    (...a: AbsoluteVerticalLineNode): R
    /** add a generic path node */
    (...a: PathNode): R
}

export interface Path extends IPath {
    append: PathAppendAPI<Path>
}

export namespace Path {
    export const New:
        (...I: IPath) => Path
    =
        (...I) => Object.assign(I, {
            append(this: Path, ...a: PathNode): Path { return New(...IPath.append(this)(...a)) }
        })
    ;
}

export namespace IPath {
    export const stringify:
        (I: IPath) => string
    =
        I => I.map(I => I.join(' ')).join("")
    ;

    export const append:
        (path: IPath) => PathAppendAPI

    =
        path => (...a: PathNode) => [...path, a]
    ;

    export const optimize:
        (I: IPath) => IPath
    =
        I => I.map(nd => {
            switch (nd[0]) {
            case 'L': case 'l':
                const [ cmd, X, Y ] = nd;
                if (X == 0 && Y != 0)
                    return cmd == 'L'? ['V', Y]: ['v', Y];
                if (Y == 0 && X != 0)
                    return cmd == 'L'? ['H', X]: ['h', X];
                return nd;
            default:
                return nd
            }
        })
    ;
}
