import { useCallback } from 'react';
import { useLocation } from '@remix-run/react';
import { ProductFilters } from '~/src/api/types';
import { productFiltersFromSearchParams, searchParamsFromProductFilters } from '~/src/api/product-utils';
import { mergeUrlSearchParams, useSearchParamsOptimistic } from '~/src/api/utils';
import { PriceFilter } from './price-filter';
import { CategoryFilter } from './category-filter';
import { SearchFilter } from './search-filter';
import { AppliedProductFilters } from '../applied-product-filters/applied-product-filters';

import styles from './product-filters.module.scss';

interface ProductFiltersProps {
    className?: string;
}

export const ProductFilters = ({ className }: ProductFiltersProps) => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParamsOptimistic();
    const filters = productFiltersFromSearchParams(searchParams);

    const handleFiltersChange = useCallback(
        (nextFilters: ProductFilters) => {
            const nextSearchParams = searchParamsFromProductFilters(nextFilters);
            setSearchParams((prev) => mergeUrlSearchParams(prev, nextSearchParams));
        },
        [setSearchParams],
    );

    return (
        <div className={className}>
            <div className={styles.filters}>
                <SearchFilter
                    value={filters.search}
                    onChange={(search) => handleFiltersChange({ ...filters, search })}
                />
                <PriceFilter
                    value={filters.price}
                    onChange={(price) => handleFiltersChange({ ...filters, price })}
                />
                <CategoryFilter
                    value={filters.categories}
                    onChange={(categories) => handleFiltersChange({ ...filters, categories })}
                />
            </div>
            <AppliedProductFilters
                className={styles.appliedFilters}
                filters={filters}
                onChange={handleFiltersChange}
            />
        </div>
    );
};
