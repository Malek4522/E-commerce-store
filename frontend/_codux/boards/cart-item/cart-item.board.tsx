import { createBoard } from '@wixc3/react-board';
import { CartItem } from '../../../src/components/cart/cart-item/cart-item';
import { cart } from '@wix/ecom';

const mockCartItem: cart.LineItem = {
    _id: '1',
    productName: { translated: 'Bamboo Toothbrush' },
    quantity: 1,
    image: 'https://static.wixstatic.com/media/c837a6_18152edaef9940ca88f446ae94b48a47~mv2.jpg/v1/fill/w_824,h_1098,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/c837a6_18152edaef9940ca88f446ae94b48a47~mv2.jpg',
    price: { formattedConvertedAmount: '$5.50' },
    fullPrice: { formattedConvertedAmount: '$7.50' },
    descriptionLines: [
        {
            name: { original: 'Size', translated: 'Size' },
            plainText: { original: 'Middle', translated: 'Middle' },
        },
        {
            name: { original: 'Color', translated: 'Color' },
            colorInfo: { original: 'green', translated: 'green', code: '#008000' },
        },
    ],
};

const noop = () => {};

export default createBoard({
    name: 'CartItem',
    Board: () => {
        return (
            <div style={{ padding: '0 20px' }}>
                <CartItem
                    item={mockCartItem}
                    priceBreakdown={{
                        lineItemPrice: { formattedConvertedAmount: '$5.50' },
                    }}
                    onQuantityChange={noop}
                    onRemove={noop}
                />
            </div>
        );
    },
    environmentProps: {
        windowHeight: 200,
        windowWidth: 360,
    },
});
