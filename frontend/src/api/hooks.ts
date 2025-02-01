import useSWR, { SWRResponse } from 'swr';
import { useApi } from './context';
import { useCart } from './cart-context';
import type { Product, Category, User } from './types';

// Product hooks
export function useProducts(options?: {
    page?: number;
    limit?: number;
    search?: string;
}): SWRResponse<{ items: Product[]; total: number }> {
    const api = useApi();
    return useSWR(['products', options], () => api.getProducts(options || {}));
}

export function useProduct(slug: string): SWRResponse<Product | undefined> {
    const api = useApi();
    return useSWR(['product', slug], () => api.getProductBySlug(slug));
}

// Category hooks
export function useCategories(): SWRResponse<Category[]> {
    const api = useApi();
    return useSWR('categories', () => api.getCategories());
}

export function useCategory(slug: string): SWRResponse<Category | null> {
    const api = useApi();
    return useSWR(['category', slug], () => api.getCategoryBySlug(slug));
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

// User hooks
export function useUserInfo() {
    const api = useApi();
    const { data: user } = useSWR('currentUser', () => api.getCurrentUser());
    
    return {
        user,
        isLoggedIn: !!user,
    };
}

export function useAuth() {
    const api = useApi();
    
    return {
        login: api.login,
        logout: api.logout,
        register: api.register,
        forgotPassword: api.forgotPassword,
        resetPassword: api.resetPassword,
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