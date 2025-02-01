import classNames from 'classnames';
import { Order, Address, ContactDetails } from '~/src/api/types';
import { OrderItem } from './order-item/order-item';
import styles from './order-summary.module.scss';

export interface OrderSummaryProps {
    className?: string;
    order: Order;
}

export const OrderSummary = ({ order, className }: OrderSummaryProps) => {
    const { items, priceSummary, shippingInfo, billingInfo, buyerNote } = order;

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.section}>
                <div className={styles.orderItems}>
                    {items.map((item) => (
                        <OrderItem key={item.id} item={item} />
                    ))}
                </div>

                <hr className={styles.divider} />

                <div className={styles.summary}>
                    {buyerNote && (
                        <div>
                            <div>Note</div>
                            <div className={styles.note}>{buyerNote}</div>
                        </div>
                    )}

                    <div className={styles.priceSummary}>
                        <div className={styles.priceDetails}>
                            <div className={styles.priceRow}>
                                <div>Subtotal</div>
                                <div>{priceSummary.subtotal.formattedAmount}</div>
                            </div>

                            <div className={styles.priceRow}>
                                <div>Delivery</div>
                                <div>
                                    {Number(priceSummary.shipping.amount) === 0
                                        ? 'Free'
                                        : priceSummary.shipping.formattedAmount}
                                </div>
                            </div>

                            <div className={styles.priceRow}>
                                <div>Sales Tax</div>
                                <div>{priceSummary.tax.formattedAmount}</div>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={classNames(styles.priceRow, styles.totalPrice)}>
                            <div>Total</div>
                            <div>{priceSummary.total.formattedAmount}</div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className={classNames(styles.divider, styles.dashed)} />

            <div className={classNames(styles.section, styles.addressSection)}>
                <div>
                    <div>Delivery address</div>
                    <ul className={styles.addressData}>
                        <li>{contactToString(shippingInfo.contact)}</li>
                        <li>{addressToString(shippingInfo.address)}</li>
                        {shippingInfo.contact.phone && <li>{shippingInfo.contact.phone}</li>}
                        {shippingInfo.deliveryTime && (
                            <li className={styles.deliveryTime}>{shippingInfo.deliveryTime}</li>
                        )}
                    </ul>
                </div>

                <div>
                    <div>Billing address</div>
                    <ul className={styles.addressData}>
                        <li>{contactToString(billingInfo.contact)}</li>
                        <li>{addressToString(billingInfo.address)}</li>
                        {billingInfo.contact.phone && <li>{billingInfo.contact.phone}</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

function addressToString(address: Address) {
    return [
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.postalCode,
        address.country,
    ]
        .filter(Boolean)
        .join(', ');
}

function contactToString(contact: ContactDetails) {
    return [contact.firstName, contact.lastName].filter(Boolean).join(' ');
}
