import { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { error, className, ...props },
    ref
) {
    return (
        <input
            ref={ref}
            className={classNames(styles.input, className, {
                [styles.error]: error,
            })}
            {...props}
        />
    );
}); 