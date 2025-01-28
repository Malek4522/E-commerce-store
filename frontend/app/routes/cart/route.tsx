import { Link, type MetaFunction } from '@remix-run/react';
import classNames from 'classnames';
import { type ReactNode } from 'react';
import { CartItem } from '~/src/components/cart/cart-item/cart-item';
import { LockIcon } from '~/src/components/icons';
import { Spinner } from '~/src/components/spinner/spinner';
import { toast } from '~/src/components/toast/toast';
import { findLineItemPriceBreakdown, useCart, useCheckout } from '~/src/wix/cart';
import { getErrorMessage } from '~/src/wix/utils';

import styles from './route.module.scss';

export default function CartPage() {
    const {
        cart,
        cartTotals,
        isCartTotalsUpdating,
        updatingCartItemIds,
        removeItem,
        updateItemQuantity,
    } = useCart();

    const handleError = (error: unknown) => toast.error(getErrorMessage(error));

    const { checkout, isCheckoutInProgress } = useCheckout({
        successUrl: '/thank-you',
        cancelUrl: '/products/all-products',
        onError: handleError,
    });

    if (cart.isLoading) {
        return (
            <CartFallback>
                <Spinner size={50} />
            </CartFallback>
        );
    }

    if (cart.error) {
        return <CartFallback>{getErrorMessage(cart.error)}</CartFallback>;
    }

    if (!cart.data || cart.data.lineItems.length === 0) {
        return (
            <CartFallback>
                <div className={styles.cartFallbackTitle}>Cart is empty</div>
                <Link to="/" className={styles.continueBrowsingLink}>
                    Continue Browsing
                </Link>
            </CartFallback>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.cart}>
                <h1 className={styles.cartHeader}>My cart</h1>
                <div className={styles.cartItems}>
                    {cart.data.lineItems.map((item) => (
                        <CartItem
                            key={item._id}
                            item={item}
                            isUpdating={updatingCartItemIds.includes(item._id!)}
                            priceBreakdown={findLineItemPriceBreakdown(item, cartTotals)}
                            onRemove={() => removeItem(item._id!).catch(handleError)}
                            onQuantityChange={(quantity: number) =>
                                updateItemQuantity({ id: item._id!, quantity }).catch(handleError)
                            }
                        />
                    ))}
                </div>
            </div>
            <div className={styles.summary}>
                <h1 className={styles.summaryHeader}>Order summary</h1>
                <div
                    className={classNames(styles.summaryContent, {
                        [styles.loading]: isCartTotalsUpdating,
                    })}
                >
                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>{cartTotals?.priceSummary?.subtotal?.formattedConvertedAmount}</span>
                    </div>
                    {cartTotals?.shippingInfo?.region && (
                        <div className={styles.summaryRow}>
                            <span>Delivery</span>
                            <span>
                                {Number(cartTotals?.priceSummary?.shipping?.amount) === 0
                                    ? 'FREE'
                                    : cartTotals?.priceSummary?.shipping?.formattedConvertedAmount}
                            </span>
                        </div>
                    )}
                    <div className={classNames(styles.summaryRow, styles.summaryTotal)}>
                        <span>Total</span>
                        <span>{cartTotals?.priceSummary?.total?.formattedConvertedAmount}</span>
                    </div>
                    {isCartTotalsUpdating && (
                        <div className={styles.spinner}>
                            <Spinner size={50} />
                        </div>
                    )}
                </div>

                <button
                    className={classNames('button', styles.checkoutButton)}
                    onClick={checkout}
                    disabled={isCheckoutInProgress || isCartTotalsUpdating}
                >
                    {isCheckoutInProgress ? <Spinner size="1lh" /> : 'Checkout'}
                </button>

                <div className={styles.secureCheckout}>
                    <LockIcon width={11} />
                    <span>Secure Checkout</span>
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

const CartFallback = ({ children }: { children: ReactNode }) => (
    <div className={styles.page}>
        <div className={styles.cart}>
            <h1 className={styles.cartHeader}>My cart</h1>
            <div className={styles.cartFallback}>{children}</div>
        </div>
    </div>
);
