import { useEffect, useMemo, useState } from 'react';
import { CartItem as ICartItem } from '~/src/api/types';
import { QuantityInput } from '~/src/components/quantity-input/quantity-input';
import { TrashIcon, ImagePlaceholderIcon } from '~/src/components/icons';
import { ProductPrice } from '~/src/components/product-price/product-price';
import { ProductLink } from '~/src/components/product-link/product-link';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { CartItemOptions } from '../cart-item-options/cart-item-options';

import styles from './cart-item.module.scss';

export interface CartItemProps {
    item: ICartItem;
    isUpdating?: boolean;
    onRemove: () => void;
    onQuantityChange: (newQuantity: number) => void;
}

export const CartItem = ({
    item,
    isUpdating = false,
    onRemove,
    onQuantityChange,
}: CartItemProps) => {
    const [quantity, setQuantity] = useState(item.quantity);

    useEffect(() => {
        if (!isUpdating) {
            setQuantity(item.quantity);
        }
    }, [item.quantity, isUpdating]);

    const updateItemQuantityDebounced = useMemo(
        () => debounce(onQuantityChange, 300),
        [onQuantityChange],
    );

    const handleQuantityChange = (value: number) => {
        setQuantity(value);
        if (value > 0) {
            updateItemQuantityDebounced(value);
        }
    };

    return (
        <div className={classNames(styles.root, { [styles.loading]: isUpdating })}>
            <div className={styles.itemContent}>
                <ProductLink productSlug={item.productSlug} className={styles.imageWrapper}>
                    {item.image ? (
                        <img src={item.image.url} alt={item.image.altText ?? item.productName} />
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            <ImagePlaceholderIcon className={styles.imagePlaceholderIcon} />
                        </div>
                    )}
                </ProductLink>

                <div className={styles.productInfo}>
                    <div className={styles.productNameAndPrice}>
                        <ProductLink productSlug={item.productSlug} className={styles.productName}>
                            {item.productName}
                        </ProductLink>
                        {item.fullPrice && (
                            <ProductPrice
                                price={item.fullPrice.formattedAmount}
                                discountedPrice={item.price.formattedAmount}
                            />
                        )}
                        {item.options && item.options.length > 0 && (
                            <CartItemOptions
                                className={styles.options}
                                options={item.options}
                                visibleOptionsCount={1}
                            />
                        )}
                    </div>

                    <div className={styles.quantity}>
                        <QuantityInput
                            value={quantity}
                            onChange={handleQuantityChange}
                            className={classNames(styles.quantityInput, {
                                [styles.quantityInputDisabled]: !item.isAvailable,
                            })}
                            disabled={!item.isAvailable}
                        />
                    </div>

                    <div className={styles.priceBreakdown}>
                        {item.price.formattedAmount}
                    </div>

                    <button
                        className={styles.removeButton}
                        onClick={onRemove}
                        aria-label="Remove item"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>

            {!item.isAvailable && (
                <div className={styles.unavailableIndication}>
                    <span>Sorry, this item is no longer available.</span>
                </div>
            )}
        </div>
    );
};
