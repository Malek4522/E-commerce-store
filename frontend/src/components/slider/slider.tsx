import * as RadixSlider from '@radix-ui/react-slider';
import type { SliderProps as RadixSliderProps } from '@radix-ui/react-slider';
import classNames from 'classnames';
import { FC, useEffect, useRef } from 'react';
import styles from './slider.module.scss';

export const Slider: FC<RadixSliderProps> = (props) => {
    props = useRadixSliderThumbReleaseFix(props);
    const value = props.value ?? props.defaultValue;
    return (
        <RadixSlider.Root {...props} className={classNames(styles.root, props.className)}>
            <RadixSlider.Track className={styles.track}>
                <RadixSlider.Range className={styles.range} />
            </RadixSlider.Track>
            {value?.map((_, i) => <RadixSlider.Thumb key={i} className={styles.thumb} />)}
        </RadixSlider.Root>
    );
};

/**
 * The RadixUI Slider doesn't reliably trigger `onValueCommit` after releasing
 * the slider thumb when using a trackpad, especially when dragging quickly.
 * This issue is consistently reproducible on a two-thumb slider by dragging
 * both thumbs to the leftmost position.
 * GitHub issue: https://github.com/radix-ui/primitives/issues/1760
 */
function useRadixSliderThumbReleaseFix(props: RadixSliderProps): RadixSliderProps {
    const changedValueRef = useRef<number[]>();
    const pointerPressedRef = useRef(false);
    const onValueCommitRef = useRef(props.onValueCommit);
    onValueCommitRef.current = props.onValueCommit;

    const onValueChange = (value: number[]) => {
        props.onValueChange?.(value);
        if (pointerPressedRef.current) {
            changedValueRef.current = value;
        } else {
            props.onValueCommit?.(value);
        }
    };

    useEffect(() => {
        const onDocumentPointerDown = () => {
            pointerPressedRef.current = true;
        };

        const onDocumentPointerUp = () => {
            pointerPressedRef.current = false;
            if (changedValueRef.current) {
                onValueCommitRef.current?.(changedValueRef.current);
                changedValueRef.current = undefined;
            }
        };

        const controller = new AbortController();
        const options = { capture: true, signal: controller.signal };
        document.addEventListener('pointerdown', onDocumentPointerDown, options);
        document.addEventListener('pointerup', onDocumentPointerUp, options);
        return () => controller.abort();
    }, []);

    return { ...props, onValueChange, onValueCommit: undefined };
}
