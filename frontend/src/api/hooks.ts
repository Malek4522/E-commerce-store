import useSWR from 'swr';
import { useApi } from './context';
import { useCart } from './cart-context';
import type { Product } from './types';

// Product hooks
export function useProducts(options?: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    const api = useApi();
    const { data, error } = useSWR(
        ['products', options],
        () => api.getProducts(options || {})
    );

    return {
        products: data?.items || [],
        total: data?.total || 0,
        isLoading: !error && !data,
        error,
    };
}

export function useProduct(slug: string) {
    const api = useApi();
    const { data, error } = useSWR(
        ['product', slug],
        () => api.getProductBySlug(slug)
    );

    return {
        product: data,
        isLoading: !error && !data,
        error,
    };
}

// Cart hooks
export function useCartOperations() {
    const api = useApi();
    const { refreshCart } = useCart();

    const addToCart = async (productId: string, quantity: number) => {
        await api.addToCart(productId, quantity);
        await refreshCart();
    };

    const updateCartItem = async (itemId: string, quantity: number) => {
        await api.updateCartItem(itemId, quantity);
        await refreshCart();
    };

    const removeFromCart = async (itemId: string) => {
        await api.removeFromCart(itemId);
        await refreshCart();
    };

    return {
        addToCart,
        updateCartItem,
        removeFromCart,
    };
}

// Product sorting
export const SORT_BY_SEARCH_PARAM = 'sort';

export enum ProductSortBy {
    NAME_ASC = 'name_asc',
    NAME_DESC = 'name_desc',
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
}

export function productSortByFromSearchParams(searchParams: URLSearchParams): ProductSortBy | undefined {
    const value = searchParams.get(SORT_BY_SEARCH_PARAM);
    return value as ProductSortBy | undefined;
}

// Product filters
export interface ProductFilter {
    type: 'price' | 'category' | 'search';
    value: string | number | { min: number; max: number };
}

export interface ProductFilters {
    price?: { min: number; max: number };
    categories?: string[];
    search?: string;
}

export function productFiltersFromSearchParams(searchParams: URLSearchParams): ProductFilters {
    const filters: ProductFilters = {};
    
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    if (priceMin && priceMax) {
        filters.price = {
            min: Number(priceMin),
            max: Number(priceMax),
        };
    }

    const categories = searchParams.getAll('category');
    if (categories.length) {
        filters.categories = categories;
    }

    const search = searchParams.get('q');
    if (search) {
        filters.search = search;
    }

    return filters;
}

export function searchParamsFromProductFilters(filters: ProductFilters): URLSearchParams {
    const params = new URLSearchParams();

    if (filters.price) {
        params.set('price_min', String(filters.price.min));
        params.set('price_max', String(filters.price.max));
    }

    if (filters.categories?.length) {
        filters.categories.forEach(category => {
            params.append('category', category);
        });
    }

    if (filters.search) {
        params.set('q', filters.search);
    }

    return params;
} 