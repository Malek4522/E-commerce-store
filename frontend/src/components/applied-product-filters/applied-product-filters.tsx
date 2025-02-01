import classNames from 'classnames';
import { ProductFilters } from '~/src/api/types';
import styles from './applied-product-filters.module.scss';

export interface AppliedProductFiltersProps {
    className?: string;
    filters: ProductFilters;
    priceRange: {
        min: number;
        max: number;
    };
    onClearFilter: (key: keyof ProductFilters) => void;
    onClearAllFilters: () => void;
}

export function AppliedProductFilters({
    className,
    filters,
    priceRange,
    onClearFilter,
    onClearAllFilters,
}: AppliedProductFiltersProps) {
    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.filters}>
                {filters.search && (
                    <div className={styles.filter}>
                        <span className={styles.filterLabel}>Search:</span>
                        <span className={styles.filterValue}>{filters.search}</span>
                        <button
                            className={styles.clearButton}
                            onClick={() => onClearFilter('search')}
                            aria-label="Clear search filter"
                        >
                            ×
                        </button>
                    </div>
                )}

                {filters.price && (
                    <div className={styles.filter}>
                        <span className={styles.filterLabel}>Price:</span>
                        <span className={styles.filterValue}>
                            ${filters.price.min} - ${filters.price.max === Infinity ? priceRange.max : filters.price.max}
                        </span>
                        <button
                            className={styles.clearButton}
                            onClick={() => onClearFilter('price')}
                            aria-label="Clear price filter"
                        >
                            ×
                        </button>
                    </div>
                )}

                {filters.categories?.map((category) => (
                    <div key={category} className={styles.filter}>
                        <span className={styles.filterLabel}>Category:</span>
                        <span className={styles.filterValue}>{category}</span>
                        <button
                            className={styles.clearButton}
                            onClick={() => onClearFilter('categories')}
                            aria-label="Clear category filter"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <button
                className={styles.clearAllButton}
                onClick={onClearAllFilters}
                aria-label="Clear all filters"
            >
                Clear All
            </button>
        </div>
    );
}
