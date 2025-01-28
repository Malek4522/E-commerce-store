import { createBoard } from '@wixc3/react-board';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '~/src/components/dropdown-menu/dropdown-menu';

import styles from './dropdown-menu.board.module.scss';

export default createBoard({
    name: 'Dropdown Menu',
    Board: () => {
        return (
            <div className={styles.container}>
                <DropdownMenu
                    trigger={<button className="button primaryButton">Open Dropdown Menu</button>}
                    contentProps={{ align: 'start' }}
                >
                    <DropdownMenuItem>Menu Item 1</DropdownMenuItem>
                    <DropdownMenuItem>Menu Item 2</DropdownMenuItem>
                    <DropdownMenuItem>
                        Menu Item With A Long Name That Is Going To Be Truncated
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>Disabled Menu Item</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <span>Exit</span>
                    </DropdownMenuItem>
                </DropdownMenu>
            </div>
        );
    },
    environmentProps: {
        windowWidth: 460,
        windowHeight: 320,
    },
});
