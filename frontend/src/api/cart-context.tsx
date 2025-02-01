import { createContext, useContext, ReactNode } from 'react';
import useSWR, { mutate } from 'swr';
import { useApi } from './context';
import type { Cart } from './types';

interface CartContextValue {
    cart: Cart | undefined;
    isLoading: boolean;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue>({
    cart: undefined,
    isLoading: false,
    refreshCart: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
    const api = useApi();
    const { data: cart, isLoading } = useSWR('cart', () => api.getCart());

    const refreshCart = async () => {
        await mutate('cart');
    };

    return (
        <CartContext.Provider value={{ cart, isLoading, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
} 