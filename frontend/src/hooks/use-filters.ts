import { useSearchParams } from '@remix-run/react';
import { ProductFilters } from '~/src/api/product-filters';

export function useFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || Infinity;
    const categories = searchParams.getAll('category');
    const search = searchParams.get('search') || undefined;

    const filters: ProductFilters = {
        search,
        ...(minPrice > 0 || maxPrice < Infinity
            ? {
                  price: {
                      min: minPrice,
                      max: maxPrice,
                  },
              }
            : {}),
        ...(categories.length > 0 ? { categories } : {}),
    };

    const someFiltersApplied = Boolean(
        search || minPrice > 0 || maxPrice < Infinity || categories.length > 0
    );

    const clearFilter = (key: keyof ProductFilters) => {
        const newParams = new URLSearchParams(searchParams);
        if (key === 'price') {
            newParams.delete('minPrice');
            newParams.delete('maxPrice');
        } else if (key === 'categories') {
            newParams.delete('category');
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearAllFilters = () => {
        const newParams = new URLSearchParams();
        setSearchParams(newParams);
    };

    return {
        filters,
        someFiltersApplied,
        clearFilter,
        clearAllFilters
    };
} 