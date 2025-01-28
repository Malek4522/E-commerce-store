import { createBoard } from '@wixc3/react-board';
import { Slider } from '~/src/components/slider/slider';

import styles from './slider.board.module.scss';

export default createBoard({
    name: 'Slider',
    Board: () => (
        <div className={styles.container}>
            <Slider className="slider" defaultValue={[50]} />
            <Slider className="slider" defaultValue={[50]} disabled />
            <Slider className="slider" defaultValue={[33, 66]} />
        </div>
    ),
    environmentProps: {
        windowWidth: 340,
        windowHeight: 228,
    },
});
