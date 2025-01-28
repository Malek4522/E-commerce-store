import { useNavigate } from '@remix-run/react';
import { Drawer } from '~/src/components/drawer/drawer';
import { toast } from '~/src/components/toast/toast';
import { useCart, useCartOpen, useCheckout } from '~/src/wix/cart';
import { getErrorMessage } from '~/src/wix/utils';
import { CartView } from './cart-view/cart-view';

export const Cart = () => {
    const { isOpen, setIsOpen } = useCartOpen();
    const navigate = useNavigate();
    const {
        cart,
        cartTotals,
        isCartTotalsUpdating,
        updatingCartItemIds,
        removeItem,
        updateItemQuantity,
    } = useCart();

    const handleError = (error: unknown) =>
        toast.error(getErrorMessage(error), {
            position: 'bottom-right',
            style: { width: 400 },
        });

    const { checkout, isCheckoutInProgress } = useCheckout({
        successUrl: '/thank-you',
        cancelUrl: '/products/all-products',
        onError: handleError,
    });

    const handleViewCart = () => {
        setIsOpen(false);
        navigate('/cart');
    };

    return (
        <Drawer onClose={() => setIsOpen(false)} open={isOpen}>
            <CartView
                cart={cart.data}
                cartTotals={cartTotals}
                error={cart.error ? getErrorMessage(cart.error) : undefined}
                onClose={() => setIsOpen(false)}
                onCheckout={checkout}
                onViewCart={handleViewCart}
                onItemRemove={(id) => removeItem(id).catch(handleError)}
                onItemQuantityChange={(args) => updateItemQuantity(args).catch(handleError)}
                isLoading={cart.isLoading}
                isUpdating={isCartTotalsUpdating}
                isCheckoutInProgress={isCheckoutInProgress}
                updatingCartItemIds={updatingCartItemIds}
            />
        </Drawer>
    );
};
