import { useSearchParams } from '@remix-run/react';
import { useMemo } from 'react';
import { productSortByFromSearchParams } from './product-sorting';

export function useProductSorting() {
    const [searchParams] = useSearchParams();
    const sorting = useMemo(() => productSortByFromSearchParams(searchParams), [searchParams]);
    return {
        sorting,
    };
}
