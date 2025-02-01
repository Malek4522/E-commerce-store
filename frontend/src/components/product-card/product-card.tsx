import { Link } from '@remix-run/react';
import classNames from 'classnames';
import { InventoryStatus } from '~/src/api/types';
import { ImagePlaceholderIcon } from '../icons';
import styles from './product-card.module.scss';

export interface ProductCardProps {
    name: string;
    slug: string;
    imageUrl?: string;
    imageAlt?: string;
    price: string;
    discountedPrice?: string;
    ribbon?: string;
    inventoryStatus?: InventoryStatus;
    className?: string;
}

export function ProductCard({
    name,
    slug,
    imageUrl,
    imageAlt,
    price,
    discountedPrice,
    ribbon,
    inventoryStatus,
    className
}: ProductCardProps) {
    const hasDiscount = discountedPrice !== undefined;

    return (
        <Link
            to={`/product-details/${slug}`}
            className={classNames(styles.root, className)}
            prefetch="intent"
        >
            <div className={styles.imageContainer}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={imageAlt || name}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <ImagePlaceholderIcon />
                    </div>
                )}
                {ribbon && (
                    <div className={styles.ribbon}>{ribbon}</div>
                )}
                {inventoryStatus === 'OUT_OF_STOCK' && (
                    <div className={styles.outOfStock}>Out of Stock</div>
                )}
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{name}</h3>
                <div className={styles.price}>
                    {hasDiscount ? (
                        <>
                            <span className={styles.discountedPrice}>
                                {discountedPrice}
                            </span>
                            <span className={styles.originalPrice}>
                                {price}
                            </span>
                        </>
                    ) : (
                        <span>{price}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export const ProductCardSkeleton = () => (
    <div className={styles.skeleton}>
        <div className={styles.imageWrapper} />
        <div className={styles.name}>&nbsp;</div>
        <div className={styles.price}>&nbsp;</div>
    </div>
);
