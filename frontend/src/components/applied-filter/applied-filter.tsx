import classNames from 'classnames';
import styles from './applied-filter.module.scss';

export interface AppliedFilterProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

export function AppliedFilter({ onClick, children, className }: AppliedFilterProps) {
    return (
        <button
            type="button"
            className={classNames(styles.root, className)}
            onClick={onClick}
            aria-label="Remove filter"
        >
            <span className={styles.content}>{children}</span>
            <span className={styles.removeIcon} aria-hidden="true">
                ×
            </span>
        </button>
    );
}
