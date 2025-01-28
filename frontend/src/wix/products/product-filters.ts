import { products } from '@wix/stores';
import { IProductFilters, ProductFilter } from '../ecom/types';

export function productFiltersFromSearchParams(params: URLSearchParams): IProductFilters {
    const minPrice = params.get(ProductFilter.minPrice);
    const maxPrice = params.get(ProductFilter.maxPrice);
    const minPriceNumber = Number(minPrice);
    const maxPriceNumber = Number(maxPrice);
    const search = params.get(ProductFilter.search) ?? undefined;
    return {
        minPrice: minPrice && !Number.isNaN(minPriceNumber) ? minPriceNumber : undefined,
        maxPrice: maxPrice && !Number.isNaN(maxPriceNumber) ? maxPriceNumber : undefined,
        search,
    };
}

export function searchParamsFromProductFilters({
    minPrice,
    maxPrice,
    search,
}: IProductFilters): URLSearchParams {
    const params = new URLSearchParams();
    if (minPrice !== undefined) params.set(ProductFilter.minPrice, minPrice.toString());
    if (maxPrice !== undefined) params.set(ProductFilter.maxPrice, maxPrice.toString());
    if (search !== undefined) params.set(ProductFilter.search, search);
    return params;
}

export function getFilteredProductsQuery(
    query: products.ProductsQueryBuilder,
    filters: IProductFilters,
) {
    if (filters.minPrice) {
        query = query.ge('priceData.price', filters.minPrice);
    }

    if (filters.maxPrice) {
        query = query.le('priceData.price', filters.maxPrice);
    }
    if (filters.search) {
        // workaround js sdk not exposing "contains" method in types.
        // implementation has it and rest API supports it
        // https://dev.wix.com/docs/rest/business-solutions/stores/catalog/filter-and-sort#query-products
        type QueryBuilderWithContains = typeof query & {
            contains(field: string, value: unknown): typeof query;
        };
        query = (query as QueryBuilderWithContains).contains('name', filters.search);
    }

    return query;
}
