import { useState } from 'react';
import { createBoard } from '@wixc3/react-board';
import { Dialog, DialogTitle, DialogDescription } from '~/src/components/dialog/dialog';

import styles from './dialog.board.module.scss';

export default createBoard({
    name: 'Dialog',
    Board: () => {
        const [open, setOpen] = useState(true);

        return (
            <div className={styles.container}>
                <button className="button primaryButton" onClick={() => setOpen(true)}>
                    Open Dialog
                </button>

                <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>Dialog description</DialogDescription>
                    <div className={styles.dialogContent}>
                        <button className="button secondaryButton" onClick={() => setOpen(false)}>
                            Close Dialog
                        </button>
                        <button className="button primaryButton" onClick={() => setOpen(true)}>
                            Primary Action
                        </button>
                    </div>
                </Dialog>
            </div>
        );
    },
    environmentProps: {
        windowWidth: 736,
        windowHeight: 528,
    },
});
