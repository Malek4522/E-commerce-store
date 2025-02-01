import { forwardRef, type InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, hasError, ...props }, ref) => {
        return (
            <div className={styles.container}>
                {label && (
                    <label className={styles.label} htmlFor={props.id || props.name}>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={classNames(styles.input, className, {
                        [styles.error]: hasError,
                    })}
                    {...props}
                />
            </div>
        );
    }
); 