import { useNavigate } from '@remix-run/react';
import { Drawer } from '~/src/components/drawer/drawer';
import { toast } from '~/src/components/toast/toast';
import { useCart, useCartOperations, getErrorMessage } from '~/src/api';
import { CartView } from './cart-view/cart-view';

export const Cart = () => {
    const { cart, isOpen, setIsOpen } = useCart();
    const { updateCartItem, removeFromCart } = useCartOperations();
    const navigate = useNavigate();

    const handleError = (error: unknown) =>
        toast.error(getErrorMessage(error), {
            position: 'bottom-right',
            style: { width: 400 },
        });

    const handleCheckout = async () => {
        try {
            // Implement checkout logic here
            navigate('/thank-you');
        } catch (error) {
            handleError(error);
        }
    };

    const handleViewCart = () => {
        setIsOpen(false);
        navigate('/cart');
    };

    return (
        <Drawer onClose={() => setIsOpen(false)} open={isOpen}>
            <CartView
                cart={cart ?? undefined}
                error={undefined}
                onClose={() => setIsOpen(false)}
                onCheckout={handleCheckout}
                onViewCart={handleViewCart}
                onItemRemove={(id) => removeFromCart(id).catch(handleError)}
                onItemQuantityChange={({ id, quantity }) => updateCartItem(id, quantity).catch(handleError)}
                isLoading={false}
                isUpdating={false}
                isCheckoutInProgress={false}
            />
        </Drawer>
    );
};
