import { useState } from 'react';
import { createBoard } from '@wixc3/react-board';
import { ColorSelect, ColorSelectOption } from '~/src/components/color-select/color-select';
import styles from './color-select.board.module.scss';

const options: ColorSelectOption[] = [
    { id: 'color1', color: 'white' },
    { id: 'color2', color: 'black' },
    { id: 'color3', color: '#00a400' },
    { id: 'color4', color: 'rgb(214, 122, 127)' },
    { id: 'color5', color: 'hsl(30deg 82% 43%)' },
];

export default createBoard({
    name: 'Color Select',
    Board: () => {
        const [colorId, setColorId] = useState('');
        return (
            <div className={styles.container}>
                <ColorSelect
                    className="colorSelect"
                    options={options}
                    selectedId={colorId}
                    onChange={setColorId}
                />
            </div>
        );
    },
    environmentProps: {
        windowWidth: 320,
        windowHeight: 100,
    },
});
