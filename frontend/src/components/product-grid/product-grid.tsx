import type { Product, Category } from '~/src/api';
import classNames from 'classnames';
import { ProductCard } from '../product-card/product-card';
import styles from './product-grid.module.scss';

export interface ProductGridProps {
    products: Product[];
    category: Category;
    filtersApplied: boolean;
    onClickClearFilters: () => void;
    className?: string;
}

export function ProductGrid({
    products,
    category,
    filtersApplied,
    onClickClearFilters,
    className,
}: ProductGridProps) {
    if (!products.length) {
        return (
            <div className={classNames(styles.root, className)}>
                <div className={styles.empty}>
                    {filtersApplied ? (
                        <div className={styles.noResults}>
                            <p>No products match your filters</p>
                            <button
                                onClick={onClickClearFilters}
                                className={styles.clearFiltersButton}
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className={styles.noProducts}>
                            <p>No products in {category.name}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price.formatted}
                        soldPrice={product.price.soldPriceFormatted}
                        isNew={product.isNew}
                        categoryId={product.categoryId}
                        imageUrl={product.images[0]?.url}
                        imageAlt={product.images[0]?.altText}
                        ribbon={product.ribbon}
                        inventoryStatus={product.inventoryStatus}
                    />
                ))}
            </div>
        </div>
    );
}
