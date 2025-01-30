import cx from 'classnames';
import styles from './varianttable.module.scss';

export interface VarianttableProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const Varianttable = ({ className }: VarianttableProps) => {
    return (
        <div className={cx(styles.root, className)}>
            <div className={styles.grid}>
                <button className={styles.button2}>Button</button>
                <button className={styles.button1}>Button</button>
            </div>
            Varianttable
        </div>
    );
};
