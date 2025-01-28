import { useEcomApi } from '../ecom';
import useSwr from 'swr';

export const useCartData = () => {
    const ecomApi = useEcomApi();
    return useSwr('cart', () => ecomApi.getCart());
};
