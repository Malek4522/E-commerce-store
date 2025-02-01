import { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import { CheckIcon } from '../icons';

import styles from './checkbox.module.scss';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Checkbox = ({ className, label, ...props }: CheckboxProps) => {
    return (
        <label className={classNames(styles.root, className)}>
            <div className={styles.checkbox}>
                <input type="checkbox" className={styles.input} {...props} />
                <div className={styles.checkmark}>
                    <CheckIcon className={styles.checkmarkIcon} />
                </div>
            </div>
            {label && <span className={styles.label}>{label}</span>}
        </label>
    );
}; 