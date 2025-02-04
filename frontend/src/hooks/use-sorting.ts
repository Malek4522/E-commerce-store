import { useSearchParams } from '@remix-run/react';
import { ProductSortBy } from '~/src/api/product-filters';

export function useSorting() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sorting = (searchParams.get('sortBy') as ProductSortBy) || ProductSortBy.NAME_ASC;

    const setSorting = (newSorting: ProductSortBy) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sortBy', newSorting);
        setSearchParams(newParams);
    };

    return {
        sorting,
        setSorting
    };
} 