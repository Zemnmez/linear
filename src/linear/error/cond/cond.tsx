import React from 'react';

/**
 * Cond is a higher order functional component
 * which displays a choice of two components
 * with the same props when rendered.
 */
export const Cond:
    <T>(True: React.FC<T>, False: React.FC<T>) =>
    React.FC<{ cond: boolean, props: T}>
=
    (True, False) => ({cond, props}) => <>
        {cond?<True {...props}/>: ""}
        {!cond?<False {...props}/>: ""}
    </>
;