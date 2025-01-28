import { useMemo } from 'react';
import { Accordion } from '~/src/components/accordion/accordion';
import { MinusIcon, PlusIcon } from '~/src/components/icons';
import { IProductFilters } from '~/src/wix/ecom';
import { productFiltersFromSearchParams, searchParamsFromProductFilters } from '~/src/wix/products';
import { mergeUrlSearchParams, useSearchParamsOptimistic } from '~/src/wix/utils';
import { PriceFilter } from './price-filter';

interface ProductFiltersProps {
    minAvailablePrice: number;
    maxAvailablePrice: number;
    currency: string;
}

export const ProductFilters = ({
    minAvailablePrice,
    maxAvailablePrice,
    currency,
}: ProductFiltersProps) => {
    const [searchParams, setSearchParams] = useSearchParamsOptimistic();

    const filters = useMemo(() => productFiltersFromSearchParams(searchParams), [searchParams]);

    const handleFiltersChange = (changed: Partial<IProductFilters>) => {
        const newParams = searchParamsFromProductFilters({ ...filters, ...changed });
        setSearchParams((params) => mergeUrlSearchParams(params, newParams), {
            preventScrollReset: true,
        });
    };

    return (
        <Accordion
            small
            expandIcon={<PlusIcon width={20} />}
            collapseIcon={<MinusIcon width={20} />}
            items={[
                {
                    header: 'Price',
                    content: (
                        <PriceFilter
                            minAvailablePrice={minAvailablePrice}
                            maxAvailablePrice={maxAvailablePrice}
                            minSelectedPrice={filters.minPrice}
                            maxSelectedPrice={filters.maxPrice}
                            currency={currency}
                            onChange={handleFiltersChange}
                        />
                    ),
                },
            ]}
            initialOpenItemIndex={0}
        />
    );
};
