import { Order } from '~/src/api/types';
import styles from './order-card.module.scss';

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    const date = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.info}>
                    <div className={styles.date}>{date}</div>
                    <div className={styles.orderId}>Order #{order.id}</div>
                </div>
                <div className={styles.status}>{order.status}</div>
            </div>
            <div className={styles.items}>
                {order.items.map((item) => (
                    <div key={item.id} className={styles.item}>
                        <div className={styles.itemName}>
                            {item.quantity}x {item.productName}
                        </div>
                        <div className={styles.itemPrice}>{item.price.formattedAmount}</div>
                    </div>
                ))}
            </div>
            <div className={styles.summary}>
                <div className={styles.summaryRow}>
                    <div>Subtotal</div>
                    <div>{order.priceSummary.subtotal.formattedAmount}</div>
                </div>
                <div className={styles.summaryRow}>
                    <div>Shipping</div>
                    <div>{order.priceSummary.shipping.formattedAmount}</div>
                </div>
                <div className={styles.summaryRow}>
                    <div>Tax</div>
                    <div>{order.priceSummary.tax.formattedAmount}</div>
                </div>
                <div className={styles.total}>
                    <div>Total</div>
                    <div>{order.priceSummary.total.formattedAmount}</div>
                </div>
            </div>
        </div>
    );
} 