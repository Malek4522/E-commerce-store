export interface ProductFilters {
    price?: { min: number; max: number };
    categories?: string[];
    search?: string;
}

export enum ProductFilter {
    minPrice = 'minPrice',
    maxPrice = 'maxPrice',
    search = 'search',
}

export enum ProductSortBy {
    NAME_ASC = 'name_asc',
    NAME_DESC = 'name_desc',
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
} 