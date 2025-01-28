import { ProductSortBy } from '~/src/wix/ecom';
import { productSortByFromSearchParams, SORT_BY_SEARCH_PARAM } from '~/src/wix/products';
import { useSearchParamsOptimistic } from '~/src/wix/utils';
import { Select, SelectItem } from '../select/select';

import styles from './product-sorting-select.module.scss';

const sortingOptions: { value: ProductSortBy; label: string }[] = [
    { value: ProductSortBy.newest, label: 'Newest' },
    { value: ProductSortBy.priceAsc, label: 'Price (low to high)' },
    { value: ProductSortBy.priceDesc, label: 'Price (high to low)' },
    { value: ProductSortBy.nameAsc, label: 'Name A-Z' },
    { value: ProductSortBy.nameDesc, label: 'Name Z-A' },
];

export const ProductSortingSelect = () => {
    const [searchParams, setSearchParams] = useSearchParamsOptimistic();

    const sortBy = productSortByFromSearchParams(searchParams);

    const handleChange = (sortBy: ProductSortBy) => {
        setSearchParams(
            (params) => {
                params.set(SORT_BY_SEARCH_PARAM, sortBy);
                return params;
            },
            { preventScrollReset: true },
        );
    };

    const renderValue = (value: ProductSortBy) => {
        const option = sortingOptions.find((option) => option.value === value)!;
        return `Sort by: ${option.label}`;
    };

    return (
        <Select
            value={sortBy}
            onValueChange={handleChange}
            className={styles.select}
            dropdownClassName={styles.selectDropdown}
            renderValue={renderValue}
        >
            {sortingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className={styles.selectItem}>
                    {option.label}
                </SelectItem>
            ))}
        </Select>
    );
};
