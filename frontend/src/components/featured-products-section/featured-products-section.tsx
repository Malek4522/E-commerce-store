import classNames from 'classnames';
import { ProductCard, ProductCardSkeleton } from '~/src/components/product-card/product-card';
import { FadeIn, Reveal } from '~/src/components/visual-effects';
import { useCategory } from '~/src/api/categories';
import { useProducts } from '~/src/api/products';
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
    const { data: products, isLoading } = useProducts({ categorySlug, limit: productCount });

    return (
        <div className={classNames(styles.root, className)}>
            <FadeIn className={styles.header} duration={1.8}>
                <h3 className={styles.headerTitle}>{title ?? category?.name ?? categorySlug}</h3>
                {description && <p className={styles.headerDescription}>{description}</p>}
            </FadeIn>
            <Reveal className={styles.products} direction="down" duration={1.4}>
                {!isLoading && products
                    ? products.map((product) => (
                          <ProductCard
                              key={product.id}
                              name={product.name}
                              slug={product.slug}
                              imageUrl={product.images[0]?.url}
                              imageAlt={product.images[0]?.altText}
                              price={product.price.formatted}
                              discountedPrice={product.price.discountedFormatted}
                              ribbon={product.ribbon}
                              inventoryStatus={product.inventoryStatus}
                          />
                      ))
                    : Array.from({ length: productCount }).map((_, i) => (
                          <ProductCardSkeleton key={i} />
                      ))}
            </Reveal>
        </div>
    );
};
