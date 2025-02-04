import classNames from 'classnames';
import { ProductSortBy } from '~/src/api/product-filters';
import styles from './product-sorting-select.module.scss';

const sortOptions = [
    { value: ProductSortBy.NAME_ASC, label: 'Nom (A-Z)' },
    { value: ProductSortBy.NAME_DESC, label: 'Nom (Z-A)' },
    { value: ProductSortBy.PRICE_ASC, label: 'Prix (Croissant)' },
    { value: ProductSortBy.PRICE_DESC, label: 'Prix (Décroissant)' },
];

export interface ProductSortingSelectProps {
    className?: string;
    value: ProductSortBy;
    onChange: (value: ProductSortBy) => void;
}

export function ProductSortingSelect({ className, value, onChange }: ProductSortingSelectProps) {
    return (
        <div className={classNames(styles.root, className)}>
            <label htmlFor="sort-by" className={styles.label}>
                Trier par :
            </label>
            <select
                id="sort-by"
                className={styles.select}
                value={value}
                onChange={(e) => onChange(e.target.value as ProductSortBy)}
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
