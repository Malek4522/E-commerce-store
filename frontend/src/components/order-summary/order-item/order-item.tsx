import { OrderItem as IOrderItem } from '~/src/api/types';
import styles from './order-item.module.scss';
import { ImagePlaceholderIcon } from '~/src/components/icons';

interface OrderItemProps {
    item: IOrderItem;
}

export const OrderItem = ({ item }: OrderItemProps) => {
    return (
        <div className={styles.root}>
            <div className={styles.imageWrapper}>
                {item.image ? (
                    <img
                        className={styles.image}
                        src={item.image.url}
                        alt={item.image.altText ?? item.productName}
                    />
                ) : (
                    <ImagePlaceholderIcon className={styles.imagePlaceholderIcon} />
                )}
            </div>

            <div className={styles.main}>
                <div>
                    <div>{item.productName}</div>
                    <div className={styles.productDetails}>
                        <div>Price: {item.price.formattedAmount}</div>
                        {item.options?.map((option, index) => (
                            <div key={index}>
                                {option.name}: {option.value}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.orderInfo}>
                    <div>Qty: {item.quantity}</div>
                    <div>{item.price.formattedAmount}</div>
                </div>
            </div>
        </div>
    );
};
