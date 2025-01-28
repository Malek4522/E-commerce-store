import { createBoard } from '@wixc3/react-board';
import { Breadcrumbs } from '~/src/components/breadcrumbs/breadcrumbs';
import ComponentWrapper from '../board-wrappers/component-wrapper';
import styles from './breadcrumbs.board.module.scss';

export default createBoard({
    name: 'Breadcrumbs',
    Board: () => (
        <ComponentWrapper>
            <div className={styles.container}>
                <Breadcrumbs
                    breadcrumbs={[
                        {
                            title: 'Home',
                            to: '/',
                        },
                        {
                            title: 'All Products',
                            to: '/products/all-products',
                        },
                        {
                            title: 'Lemongrass Natural Soap',
                            to: '/product-details/lemongrass-natural-soap',
                        },
                    ]}
                />
            </div>
        </ComponentWrapper>
    ),
    environmentProps: {
        windowWidth: 400,
        windowHeight: 100,
    },
});
