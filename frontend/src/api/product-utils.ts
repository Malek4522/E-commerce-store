import { ProductSortBy, ProductFilter, ProductFilters } from './types';

export const SORT_BY_SEARCH_PARAM = 'sort';

export function productSortByFromSearchParams(searchParams: URLSearchParams): ProductSortBy | undefined {
    const value = searchParams.get(SORT_BY_SEARCH_PARAM);
    return value as ProductSortBy | undefined;
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

export function getChoiceValue(choice: { value: string }): string {
    return choice.value;
}

export function getProductImageUrl(url: string): string {
    return url;
} 