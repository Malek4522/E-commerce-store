import { createBoard } from '@wixc3/react-board';
import ComponentWrapper from '_codux/board-wrappers/component-wrapper';

export default createBoard({
    name: 'New Board',
    Board: () => (
        <ComponentWrapper>
            <div></div>
        </ComponentWrapper>
    ),
});
