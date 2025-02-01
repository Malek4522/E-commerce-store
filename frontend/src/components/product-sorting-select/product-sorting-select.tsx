import classNames from 'classnames';
import { ProductSortBy } from '~/src/api/types';
import { useSorting } from '~/src/hooks/use-sorting';
import styles from './product-sorting-select.module.scss';

const sortOptions = [
    { value: ProductSortBy.NAME_ASC, label: 'Name (A-Z)' },
    { value: ProductSortBy.NAME_DESC, label: 'Name (Z-A)' },
    { value: ProductSortBy.PRICE_ASC, label: 'Price (Low to High)' },
    { value: ProductSortBy.PRICE_DESC, label: 'Price (High to Low)' },
];

export interface ProductSortingSelectProps {
    className?: string;
}

export function ProductSortingSelect({ className }: ProductSortingSelectProps) {
    const { sorting, setSorting } = useSorting();

    return (
        <div className={classNames(styles.root, className)}>
            <label htmlFor="sort-by" className={styles.label}>
                Sort by:
            </label>
            <select
                id="sort-by"
                className={styles.select}
                value={sorting}
                onChange={(e) => setSorting(e.target.value as ProductSortBy)}
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
