import useSWR, { type SWRResponse } from 'swr';
import { useApi } from './context';
import type { Product, Category } from './types';
import type { ProductSortBy } from './product-filters';

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

// Product sorting
export const SORT_BY_SEARCH_PARAM = 'sort';

export function productSortByFromSearchParams(searchParams: URLSearchParams): ProductSortBy | undefined {
    const value = searchParams.get(SORT_BY_SEARCH_PARAM);
    return value as ProductSortBy | undefined;
} 