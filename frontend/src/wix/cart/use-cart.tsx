import { useEffect, useState } from 'react';
import useSwr, { Key, mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { useEcomApi } from '../ecom/api-context';
import { AddToCartOptions } from '../ecom/types';
import { findItemIdInCart } from './cart-utils';
import { useCartData } from './use-cart-data';

const useCartTotals = () => {
    const ecomApi = useEcomApi();
    const cart = useCartData();
    useEffect(() => void mutate('cart-totals'), [cart.data]);
    return useSwr('cart-totals', () => ecomApi.getCartTotals());
};

interface AddToCartArgs {
    id: string;
    quantity: number;
    options?: AddToCartOptions;
}

const useAddToCart = () => {
    const ecomApi = useEcomApi();
    const { data: cart } = useCartData();
    return useSWRMutation(
        'cart',
        (_key: Key, { arg }: { arg: AddToCartArgs }) => {
            const itemInCart = cart ? findItemIdInCart(cart, arg.id, arg.options) : undefined;

            if (itemInCart) {
                return ecomApi.updateCartItemQuantity(
                    itemInCart._id!,
                    (itemInCart.quantity ?? 0) + arg.quantity,
                );
            }

            return ecomApi.addToCart(arg.id, arg.quantity, arg.options);
        },
        {
            revalidate: false,
            populateCache: true,
        },
    );
};

interface UpdateCartItemQuantityArgs {
    id: string;
    quantity: number;
}

const useUpdateCartItemQuantity = () => {
    const ecomApi = useEcomApi();
    return useSWRMutation(
        'cart',
        (_key: Key, { arg }: { arg: UpdateCartItemQuantityArgs }) =>
            ecomApi.updateCartItemQuantity(arg.id, arg.quantity),
        {
            revalidate: false,
            populateCache: true,
        },
    );
};

const useRemoveItemFromCart = () => {
    const ecomApi = useEcomApi();
    return useSWRMutation('cart', (_key, { arg }: { arg: string }) => ecomApi.removeFromCart(arg), {
        revalidate: false,
        populateCache: true,
    });
};

export const useCart = () => {
    const [updatingCartItemIds, setUpdatingCartItems] = useState<string[]>([]);

    const cart = useCartData();
    const { data: cartTotals, isValidating: isCartTotalsValidating } = useCartTotals();

    const { trigger: triggerUpdateItemQuantity } = useUpdateCartItemQuantity();
    const { trigger: triggerRemoveItem } = useRemoveItemFromCart();
    const { trigger: triggerAddToCart, isMutating: isAddingToCart } = useAddToCart();

    const updateItemQuantity = ({ id, quantity }: { id: string; quantity: number }) => {
        setUpdatingCartItems((prev) => [...prev, id]);
        return triggerUpdateItemQuantity({ id, quantity }).finally(() => {
            setUpdatingCartItems((prev) => prev.filter((itemId) => itemId !== id));
        });
    };

    const removeItem = (id: string) => {
        setUpdatingCartItems((prev) => [...prev, id]);
        return triggerRemoveItem(id).finally(() => {
            setUpdatingCartItems((prev) => prev.filter((itemId) => itemId !== id));
        });
    };

    const addToCart = (productId: string, quantity: number, options?: AddToCartOptions) =>
        triggerAddToCart({ id: productId, quantity, options });

    return {
        cart,
        cartTotals,
        updatingCartItemIds,

        isAddingToCart,
        isCartTotalsUpdating: updatingCartItemIds.length > 0 || isCartTotalsValidating,

        updateItemQuantity,
        removeItem,
        addToCart,
    };
};
