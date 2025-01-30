import type { SerializeFrom } from '@remix-run/node';
import classNames from 'classnames';
import React from 'react';
import type { Product, InventoryStatus } from '~/src/api';
import { getProductImageUrl } from '~/src/api';
import { EmptyProductsCategory } from '../empty-products-category/empty-products-category';
import { ProductCard } from '../product-card/product-card';
import { ProductLink } from '../product-link/product-link';
import styles from './product-grid.module.scss';

export interface ProductGridProps {
    /** list of products to show (either from API or serialized from loader) */
    products: Array<Product | SerializeFrom<Product>>;
    /** category containing the shown products */
    category: {
        name: string;
        slug: string;
        numberOfProducts: number;
    };
    /** are there any filters appiled to the passed product list */
    filtersApplied?: boolean;
    /** called when user clicks the "Clear Filters" link (shown when filters applied + no products found)  */
    onClickClearFilters?: () => void;
}

export const ProductGrid = React.memo<ProductGridProps>(function ProductGrid({
    category,
    products,
    filtersApplied,
    onClickClearFilters,
}) {
    if (category.numberOfProducts === 0) {
        return (
            <EmptyProductsCategory
                title="No products here yet..."
                subtitle="In the meantime, you can choose a different category to continue shopping."
            />
        );
    }

    if (filtersApplied && products.length === 0) {
        return (
            <EmptyProductsCategory
                title="We couldn't find any matches"
                subtitle="Try different filters or another category."
                actionButton={
                    <button
                        className={classNames(styles.clearFiltersButton, 'linkButton')}
                        onClick={onClickClearFilters}
                    >
                        Clear Filters
                    </button>
                }
            />
        );
    }

    const formatPrice = (price?: number) => {
        if (!price) return undefined;
        return price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const getInventoryStatus = (stock: number): InventoryStatus => 
        stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';

    return (
        <div className={styles.productGrid}>
            {products.map((product) => (
                <ProductLink
                    key={product.id}
                    className={styles.productLink}
                    productSlug={product.slug}
                    state={{
                        fromCategory: {
                            name: category.name,
                            slug: category.slug,
                        },
                    }}
                >
                    <ProductCard
                        name={product.title}
                        imageUrl={getProductImageUrl(product)}
                        price={formatPrice(product.price)}
                        discountedPrice={formatPrice(product.discountedPrice)}
                        ribbon={product.ribbon}
                        inventoryStatus={getInventoryStatus(product.stock)}
                    />
                </ProductLink>
            ))}
        </div>
    );
});
