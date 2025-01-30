import classNames from 'classnames';
import { ReactNode } from 'react';
import { CrossIcon, LockIcon } from '~/src/components/icons';
import { Spinner } from '~/src/components/spinner/spinner';
import { getCartItemCount } from '~/src/api';
import type { Cart } from '~/src/api';
import { CartItem } from '../cart-item/cart-item';

import styles from './cart-view.module.scss';

export interface CartViewProps {
    cart?: Cart;
    error?: string;
    isLoading: boolean;
    isUpdating?: boolean;
    isCheckoutInProgress: boolean;
    onClose: () => void;
    onCheckout: () => void;
    onViewCart: () => void;
    onItemQuantityChange: (args: { id: string; quantity: number }) => void;
    onItemRemove: (id: string) => void;
}

export const CartView = ({
    cart,
    error,
    isLoading,
    isUpdating = false,
    isCheckoutInProgress,
    onClose,
    onCheckout,
    onViewCart,
    onItemQuantityChange,
    onItemRemove,
}: CartViewProps) => {
    if (isLoading) {
        return (
            <CartFallback>
                <Spinner size={50} />
            </CartFallback>
        );
    }

    if (error) {
        return <CartFallback>{error}</CartFallback>;
    }

    const itemCount = cart ? getCartItemCount(cart) : 0;

    return (
        <div className={styles.cart}>
            <div className={styles.header}>
                <span className="heading6">
                    Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
                <button className={classNames(styles.closeButton, 'iconButton')} onClick={onClose}>
                    <CrossIcon />
                </button>
            </div>

            {!cart || cart.items.length === 0 ? (
                <CartFallback>Your cart is empty.</CartFallback>
            ) : (
                <>
                    <div className={styles.cartItems}>
                        {cart.items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                isUpdating={false}
                                onQuantityChange={(quantity: number) =>
                                    onItemQuantityChange({ id: item.id, quantity })
                                }
                                onRemove={() => onItemRemove(item.id)}
                            />
                        ))}
                    </div>

                    <div className={styles.footer}>
                        {cart.subtotal && (
                            <>
                                <div className={styles.subtotal}>
                                    <span>Subtotal</span>
                                    <span>${cart.subtotal.toFixed(2)}</span>
                                </div>
                                <div className={styles.subtotalNote}>
                                    Taxes and shipping are calculated at checkout.
                                </div>
                            </>
                        )}

                        <button
                            className={classNames(
                                'button',
                                'mutedPrimaryButton',
                                styles.checkoutButton,
                            )}
                            onClick={onCheckout}
                            disabled={isCheckoutInProgress || isUpdating}
                        >
                            {isCheckoutInProgress ? <Spinner size="1lh" /> : 'Checkout'}
                        </button>
                        <button
                            className={classNames('button', styles.viewCartButton)}
                            onClick={onViewCart}
                        >
                            View Cart
                        </button>

                        <div className={styles.secureCheckout}>
                            <LockIcon width={11} />
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const CartFallback = ({ children }: { children: ReactNode }) => (
    <div className={styles.cartFallback}>{children}</div>
);
