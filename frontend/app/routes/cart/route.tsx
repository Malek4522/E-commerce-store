import { json } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/react';
import { useCart } from '~/src/api/cart-context';
import { CartItem } from '~/src/components/cart-item/cart-item';

import styles from './route.module.scss';

export async function loader() {
    return json({});
}

export default function CartRoute() {
    const { cart, isLoading } = useCart();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!cart?.items.length) {
        return <div>Your cart is empty</div>;
    }

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Shopping Cart</h1>
            <div className={styles.content}>
                <div className={styles.items}>
                    {cart.items.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>
                <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>${cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Tax</span>
                        <span>${cart.tax.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryTotal}>
                        <span>Total</span>
                        <span>${cart.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Cart | ReClaim' },
        {
            name: 'description',
            content: 'Essential home products for sustainable living',
        },
        {
            property: 'robots',
            content: 'noindex, nofollow',
        },
    ];
};
