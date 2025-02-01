import classNames from 'classnames';
import styles from './color-select.module.scss';

export interface ColorSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface ColorSelectProps {
    options: ColorSelectOption[];
    value: string;
    onChange: (value: string) => void;
    hasError?: boolean;
    className?: string;
}

export function ColorSelect({
    options,
    value,
    onChange,
    hasError,
    className
}: ColorSelectProps) {
    return (
        <div className={classNames(styles.root, className, { [styles.error]: hasError })}>
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={classNames(styles.option, {
                        [styles.selected]: option.value === value,
                        [styles.disabled]: option.disabled
                    })}
                    onClick={() => !option.disabled && onChange(option.value)}
                    disabled={option.disabled}
                    title={option.label}
                    style={{ backgroundColor: option.value }}
                />
            ))}
        </div>
    );
}
