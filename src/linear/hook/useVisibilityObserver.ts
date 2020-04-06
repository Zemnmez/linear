import { useIntersectionObserver, useIntersectionObserverProps } from './useIntersectionObserver';

export interface useVisibilityObserverProps extends useIntersectionObserverProps {}

export const useVisibilityObserver:
    <T extends Element>(cfg?: useIntersectionObserverProps) =>
    { visible?: boolean, ref: (el: T | null) => void }
=
    p => {
        const { intersection, ref } = useIntersectionObserver(p);
        const visible = intersection?.isIntersecting;
        return {visible, ref };
    }
;

export default useVisibilityObserver;