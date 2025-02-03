import type { SerializeFrom } from '@remix-run/node';
import classNames from 'classnames';
import React from 'react';
import type { Product, InventoryStatus, Category } from '~/src/api';
import { getProductImageUrl } from '~/src/api';
import { EmptyProductsCategory } from '../empty-products-category/empty-products-category';
import { ProductCard, ProductCardSkeleton } from '../product-card/product-card';
import { ProductLink } from '../product-link/product-link';
import styles from './product-grid.module.scss';
import { useProducts } from '~/src/api/hooks';

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
