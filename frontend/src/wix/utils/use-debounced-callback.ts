import debounce from 'lodash.debounce';
import type { DebouncedFunc } from 'lodash';
import { useMemo, useRef } from 'react';

/**
 * Returns a debounced version of the provided callback function.
 *
 * IMPORTANT: remember to cancel or flush the debounced function on unmount to
 * prevent state updates on unmounted components. Examples:
 * - `useEffect(() => debouncedFunc.cancel, [debouncedFunc])`
 * - `useEffect(() => debouncedFunc.flush, [debouncedFunc])`
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
    func: T,
    delay: number,
): DebouncedFunc<T> => {
    const funcRef = useRef(func);
    funcRef.current = func;

    const debouncedFunc = useMemo(() => {
        return debounce((...args) => funcRef.current(...args), delay);
    }, [delay]);

    return debouncedFunc;
};
