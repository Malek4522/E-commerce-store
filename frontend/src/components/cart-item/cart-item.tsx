import { CartItem as CartItemType } from '~/src/api/types';
import { useCartOperations } from '~/src/api/hooks';
import { formatPrice } from '~/src/utils/price-utils';
import { ImagePlaceholderIcon, MinusIcon, PlusIcon, TrashIcon } from '../icons';
import classNames from 'classnames';

import styles from './cart-item.module.scss';

interface CartItemProps {
    item: CartItemType;
    className?: string;
}

export function CartItem({ item, className }: CartItemProps) {
    const { updateCartItem, removeFromCart } = useCartOperations();

    const handleQuantityChange = (delta: number) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity > 0) {
            updateCartItem(item.id, newQuantity);
        }
    };

    const handleRemove = () => {
        removeFromCart(item.id);
    };

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.image}>
                {item.image?.url ? (
                    <img src={item.image.url} alt={item.image.altText || item.productName} />
                ) : (
                    <ImagePlaceholderIcon />
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.name}>{item.productName}</div>
                {item.options?.map((option) => (
                    <div key={option.name} className={styles.option}>
                        {option.name}: {option.value}
                    </div>
                ))}
            </div>
            <div className={styles.quantity}>
                <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={item.quantity <= 1}
                >
                    <MinusIcon />
                </button>
                <span className={styles.quantityValue}>{item.quantity}</span>
                <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(1)}
                >
                    <PlusIcon />
                </button>
            </div>
            <div className={styles.price}>
                {item.price.formattedAmount}
                {item.fullPrice && (
                    <span className={styles.fullPrice}>{item.fullPrice.formattedAmount}</span>
                )}
            </div>
            <button className={styles.removeButton} onClick={handleRemove}>
                <TrashIcon />
            </button>
        </div>
    );
} 