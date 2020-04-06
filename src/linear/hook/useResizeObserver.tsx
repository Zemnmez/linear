import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export const useResizeObserver:
    <T extends Element>() => {
        wh?: [number, number],
        ref: (el: T | null) => void,
    }
=
    <T extends Element>() => {
        const [dimensions, setDimensions] = React.useState<[number, number]>();
        const [element, setElement] = React.useState<Element>();

        const ref = React.useCallback(
            (el: T | null) => { if(el) setElement(el) }
        , [ setElement ]);

        React.useEffect(
            () => {
                if (!element) return;

                const observer = new ResizeObserver(
                    ([ { contentRect: { width, height }}]) =>
                        setDimensions([width, height])
                );

                observer.observe(element);

                return () => observer.disconnect();
            }
        , [ element ]);

        return {
            wh: dimensions,
            ref
        };
    }
;

export default useResizeObserver;