import { Link } from '@remix-run/react';
import classNames from 'classnames';
import { InventoryStatus } from '~/src/api/types';
import { ImagePlaceholderIcon } from '../icons';
import styles from './product-card.module.scss';

export interface ProductCardProps {
    id: string;
    name: string;
    imageUrl?: string;
    imageAlt?: string;
    price: string;
    soldPrice?: string;
    ribbon?: string;
    isNew?: boolean;
    categoryId?: string;
    inventoryStatus?: InventoryStatus;
    className?: string;
}

export function ProductCard({
    id,
    name,
    imageUrl,
    imageAlt,
    price,
    soldPrice,
    ribbon,
    isNew,
    categoryId,
    inventoryStatus,
    className
}: ProductCardProps) {
    const hasDiscount = (soldPrice !== undefined && 
        soldPrice !== price && 
        parseFloat(soldPrice || '0') > 0) || 
        categoryId === 'sold';

    const isNewProduct = isNew || categoryId === 'new-in';

    return (
        <Link
            to={`/product-details/${id}`}
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
                {isNewProduct ? (
                    <div className={styles.ribbon}>NEW</div>
                ) : hasDiscount ? (
                    <div className={styles.ribbon}>SALE</div>
                ) : ribbon ? (
                    <div className={styles.ribbon}>{ribbon}</div>
                ) : null}
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
                                {soldPrice}
                            </span>
                            <span className={styles.originalPrice}>
                                {price}
                            </span>
                        </>
                    ) : (
                        <span className={styles.regularPrice}>{price}</span>
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