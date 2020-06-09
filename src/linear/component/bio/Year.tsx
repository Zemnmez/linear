import style from 'linear/component/bio/style';
import Month from 'linear/component/bio/Month';
import React from 'react';

export const StretchMarkers = () => <>
    <div className={style.stretchMarkerM}>
        <div className={style.stretchMarkerLine} />
    </div>
</>

export interface YearProps {
    year: number
    months: Month[]
}

export type Year = YearProps
export const Year:
    React.FC<Year>
=
    ({ year, months }) => <div {...{
        'data-year': year,
        className: style.Year
    }}>
    <article>
    {months.map((m, i) => <Month key={i} {...m}/>)}
    </article>
    <StretchMarkers/>
    </div>;
;



export default Year;