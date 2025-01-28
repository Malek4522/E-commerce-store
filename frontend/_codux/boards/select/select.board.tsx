import { useState } from 'react';
import { createBoard } from '@wixc3/react-board';
import { Select, SelectItem } from '~/src/components/select/select';

import styles from './select.board.module.scss';

export default createBoard({
    name: 'Select',
    Board: () => {
        const [value, setValue] = useState('');
        return (
            <div className={styles.container}>
                <Select value={value} onValueChange={setValue} placeholder="Choose a pet">
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="hamster">Hamster</SelectItem>
                    <SelectItem value="parrot">Parrot</SelectItem>
                    <SelectItem value="spider">Spider</SelectItem>
                    <SelectItem value="goldfish">Goldfish</SelectItem>
                </Select>
            </div>
        );
    },
    environmentProps: {
        windowWidth: 400,
        windowHeight: 400,
    },
});
