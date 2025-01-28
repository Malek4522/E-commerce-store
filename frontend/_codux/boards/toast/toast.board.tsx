import { createBoard } from '@wixc3/react-board';
import { Toast, ToastData } from '~/src/components/toast/toast';

import styles from './toast.board.module.scss';

export default createBoard({
    name: 'Toast',
    Board: () => {
        return (
            <div className={styles.container}>
                <Toast toast={createToast('success', 'Product added to cart')} />
                <Toast toast={createToast('error', 'Unable to update item quantity')} />
                <Toast toast={createToast('blank', 'Planned maintenance on April 25')} />
                <Toast toast={createToast('loading', 'Searching for products...')} />
            </div>
        );
    },
    environmentProps: {
        windowWidth: 500,
        windowHeight: 260,
    },
});

const createToast = (type: ToastData['type'], message: string): ToastData => ({
    id: '',
    type,
    message,
    createdAt: 0,
    visible: true,
    pauseDuration: 0,
    ariaProps: {
        role: 'status',
        'aria-live': 'polite',
    },
});
