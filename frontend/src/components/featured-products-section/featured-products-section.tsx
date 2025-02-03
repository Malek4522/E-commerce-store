import classNames from 'classnames';
import { ProductCard, ProductCardSkeleton } from '~/src/components/product-card/product-card';
import { FadeIn, Reveal } from '~/src/components/visual-effects';
import { useCategory } from '~/src/api/categories';
import { useProducts } from '~/src/api/products';
import { Link } from '@remix-run/react';
import styles from './featured-products-section.module.scss';

interface FeaturedProductsSectionProps {
    categorySlug: string;
    title?: string;
    description?: JSX.Element | string;
    productCount?: number;
    className?: string;
}

export const FeaturedProductsSection = (props: FeaturedProductsSectionProps) => {
    const { title, description, productCount = 4, categorySlug, className } = props;
    const { data: category } = useCategory(categorySlug);
    const { data: products, isLoading } = useProducts({ categorySlug });

    const hasMoreProducts = products && products.length > productCount;
    const displayProducts = products ? products.slice(0, productCount) : [];

    return (
        <div className={classNames(styles.root, className)}>
            <FadeIn className={styles.header} duration={1.8}>
                <div className={styles.headerLeft}>
                    <h3 className={styles.headerTitle}>{title ?? category?.name ?? categorySlug}</h3>
                    {description && <p className={styles.headerDescription}>{description}</p>}
                </div>
            </FadeIn>
            <Reveal className={styles.products} direction="down" duration={1.4}>
                {!isLoading && displayProducts
                    ? displayProducts.map((product) => (
                          <ProductCard
                              key={product.id}
                              id={product.id}
                              name={product.name}
                              imageUrl={product.images[0]?.url}
                              imageAlt={product.images[0]?.altText}
                              price={product.price.formatted}
                              soldPrice={product.price.soldPriceFormatted}
                              ribbon={product.ribbon}
                              inventoryStatus={product.inventoryStatus}
                          />
                      ))
                    : Array.from({ length: productCount }).map((_, i) => (
                          <ProductCardSkeleton key={i} />
                      ))}
            </Reveal>
            {hasMoreProducts && (
                <Link 
                    to={`/products/${categorySlug}`} 
                    className={classNames(
                        styles.seeAllLink,
                        { [styles.seeAllLinkSale]: categorySlug === 'sold' }
                    )}
                >
                    Explore All
                    <span className={styles.seeAllArrow}>→</span>
                </Link>
            )}
        </div>
    );
};
