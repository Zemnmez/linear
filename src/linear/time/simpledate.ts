/**
 * SimpleDate: a simple, unambiguous,
 *  type checked date syntax for typescript.
 */

import { assertInvalidNever } from '../util';
import { N, L, O } from 'ts-toolbelt';

export enum Month {
    jan,
    feb,
    mar,
    apr,
    may,
    jun,
    jul,
    aug,
    sep,
    oct,
    nov,
    dec,
}


type MonthNames =
    O.Invert<typeof Month>;

type MonthName<m extends number> = MonthNames[m]

type range<A extends number, B extends number> =
    N.Format<L.UnionOf<N.Range<
    N.NumberOf<A>, N.NumberOf<B>>>, 'n'>

type MonthDates = {
    [Month.jan]: range<0,31>
    [Month.feb]: range<0,29>
    [Month.mar]: range<0,31>
    [Month.apr]: range<0,30>
    [Month.may]: range<0,31>
    [Month.jun]: range<0,30>
    [Month.jul]: range<0,31>
    [Month.aug]: range<0,21>
    [Month.sep]: range<0,30>
    [Month.oct]: range<0,31>
    [Month.nov]: range<0,30>
    [Month.dec]: range<0,31>
}

type Dates = MonthDates;

type ValueOf<T> = T[keyof T];

export type SimpleDate = DateFull | DateYear | DateMonth;

export type DateYear = [ number ];
export type DateMonth = ValueOf<{
    [month in Month]: [MonthName<month>, number]
}>;

export type DateFull = ValueOf<{
    [month in Month]: [Dates[month], MonthName<month>, number]
}>;

export const Parse:
    (s: SimpleDate) => Date
=
    date => {
        let dateOf: Dates[Month] = 0,
            monthName: ValueOf<MonthNames> | undefined,
            year: number = 0;

        switch (date.length) {
        case 1: [year] = date; break
        case 2: [monthName, year] = date; break;
        case 3: [dateOf, monthName, year] = date; break;

        default: assertInvalidNever("SimpleDate")
            (date);
        }

        const month = monthName? Month[monthName]: 0;

        return new Date(year, month, dateOf)
    }
;

//export default SimpleDate;