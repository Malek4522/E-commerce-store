import { createBoard } from '@wixc3/react-board';
import { Avatar } from '~/src/components/avatar/avatar';

import styles from './avatar.board.module.scss';

export default createBoard({
    name: 'Avatar',
    Board: () => {
        return (
            <div className={styles.container}>
                <Avatar imageSrc={undefined} />
                <Avatar
                    imageSrc={
                        'https://static.wixstatic.com/media/d8b1a6aa64c642e28d9c2b13665868be.jpg/v1/crop/x_1842,y_741,w_2250,h_2051/fill/w_424,h_388,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_auto/Maneki-neko.jpg'
                    }
                />
            </div>
        );
    },
    environmentProps: {
        windowWidth: 320,
        windowHeight: 100,
    },
});
