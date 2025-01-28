import { createBoard } from '@wixc3/react-board';
import { toast } from '~/src/components/toast/toast';
import { Toaster } from '~/src/components/toaster/toaster';

import styles from './toaster.board.module.scss';

export default createBoard({
    name: 'Toaster',
    Board: () => {
        return (
            <div className={styles.container}>
                <Toaster />
                <button className="button" onClick={() => toast('Info')}>
                    Open info toast
                </button>
                <button className="button" onClick={() => toast.success('Success')}>
                    Open success toast
                </button>
                <button className="button" onClick={() => toast.error('Error')}>
                    Open error toast
                </button>
                <button
                    className="button"
                    onClick={() => toast.loading('Loading...', { duration: 2000 })}
                >
                    Open loading toast
                </button>
            </div>
        );
    },
    environmentProps: {
        windowHeight: 300,
        windowWidth: 1100,
    },
});
