import { createContext, useContext, useState, ReactNode } from 'react';
import { Cart } from './types';
import { useApi } from './context';

interface CartContextType {
    cart: Cart | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}

interface Props {
    children: ReactNode;
}

export function CartProvider({ children }: Props) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const api = useApi();

    const refreshCart = async () => {
        try {
            const updatedCart = await api.getCart();
            setCart(updatedCart || null);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, isOpen, setIsOpen, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
} 