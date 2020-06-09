import React from 'react';
import sortablehoc from 'react-sortable-hoc';

export interface Sortable<T> {
    value: T
    /** unique key within the SortProps */
    key: string
    render: React.FC<{
        value: T,
    }>
}

export interface SortProps<T> {
    items: Sortable<T>[]
}

export interface _SortableItemProps<T> extends Sortable<T> {}

const _SortableItem:
    (props: _SortableItemProps<any>) => React.ReactElement
=
    ({ value, render: Component }) => <Component {...{ value }} />
;

const SortableItem = sortablehoc.SortableElement(
    _SortableItem
)

const _SortableList:
    <T>(props: SortProps<T>) => React.ReactElement
=
    ({items }) => <ol>
        {items.map(({ key, ...etc}, index) =>
            <SortableItem {...{
                key,
                index,
                ...etc
            }}/>
        )}
    </ol>
;

const SortableList = sortablehoc.SortableContainer(_SortableList);
export {SortableList as Sort, SortableList as default};