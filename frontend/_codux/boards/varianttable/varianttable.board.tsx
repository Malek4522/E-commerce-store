import { createBoard } from '@wixc3/react-board';
import { Varianttable } from '../../../src/components/varianttable/varianttable';

export default createBoard({
    name: 'Varianttable',
    Board: () => <Varianttable />,
});
