import * as RadixSlider from '@radix-ui/react-slider';
import classNames from 'classnames';

import styles from './slider.module.scss';

export interface SliderProps {
    min: number;
    max: number;
    step: number;
    value: number[];
    onChange: (value: number[]) => void;
    formatLabel?: (min: number, max: number) => string;
    className?: string;
}

export const Slider = ({
    min,
    max,
    step,
    value,
    onChange,
    formatLabel,
    className,
}: SliderProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            <RadixSlider.Root
                className={styles.slider}
                min={min}
                max={max}
                step={step}
                value={value}
                onValueChange={onChange}
            >
                <RadixSlider.Track className={styles.track}>
                    <RadixSlider.Range className={styles.range} />
                </RadixSlider.Track>
                {value.map((v, i) => (
                    <RadixSlider.Thumb key={i} className={styles.thumb} />
                ))}
            </RadixSlider.Root>
            {formatLabel && (
                <div className={styles.labels}>
                    <div>{formatLabel(value[0], value[1])}</div>
                </div>
            )}
        </div>
    );
};
