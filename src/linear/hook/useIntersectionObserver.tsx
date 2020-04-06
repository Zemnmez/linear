import 'intersection-observer';
import React from 'react';


export interface useIntersectionObserverProps extends Omit<IntersectionObserverInit, 'root'> {

}

export const useIntersectionObserver:
    <T extends Element>(cfg?: useIntersectionObserverProps) =>
    { intersection?: IntersectionObserverEntry, ref: (el: T | null) => void }
=
    <T extends Element>(props: useIntersectionObserverProps = {}) => {
        const [intersection, setIntersection] = React.useState<
            IntersectionObserverEntry | undefined>();
        const [element, setElement] = React.useState<Element>();

        const ref = React.useCallback(
            (el: T | null) => { if (el) setElement(el )}
        , [ setElement ]);

        React.useEffect(
            () => {
                if (!element) return;

                const observer = new IntersectionObserver(
                    ([ entry ]) => setIntersection(entry),
                    props
                );

                observer.observe(element);

                return () => observer.disconnect();
            }
        , [ element ]);

        return {
            intersection,
            ref
        }
    }
;


export default useIntersectionObserver;