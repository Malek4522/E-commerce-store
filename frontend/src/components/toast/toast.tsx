import classNames from 'classnames';
import { Toast as ToastData, toast, resolveValue } from 'react-hot-toast';
import { CrossIcon } from '~/src/components/icons';

import styles from './toast.module.scss';

export { toast, type ToastData };

const dismissToast = (id: string) => toast.dismiss(id);

export const Toast = ({ toast }: { toast: ToastData }) => {
    const variantClassName = {
        success: styles.success,
        error: styles.error,
        blank: styles.blank,
        loading: styles.loading,
        custom: '',
    }[toast.type];

    const animationClassName = toast.visible ? styles.enterAnimation : styles.exitAnimation;

    return (
        <div
            className={classNames(
                styles.root,
                variantClassName,
                animationClassName,
                toast.className,
            )}
            style={toast.style}
            {...toast.ariaProps}
        >
            <div className={styles.message}>{resolveValue(toast.message, toast)}</div>
            {toast.type === 'loading' ? null : (
                <button className={styles.closeButton} onClick={() => dismissToast(toast.id)}>
                    <CrossIcon />
                </button>
            )}
        </div>
    );
};
