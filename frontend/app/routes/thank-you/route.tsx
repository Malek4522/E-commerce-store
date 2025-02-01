import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Order } from '~/src/api/types';
import { initializeApiForRequest } from '~/src/api/session';
import { OrderCard } from '~/src/components/order-card/order-card';
import styles from './route.module.scss';

interface LoaderData {
    order: Order;
}

export async function loader({ request }: LoaderFunctionArgs) {
    const { isAuthenticated } = await initializeApiForRequest(request);
    if (!isAuthenticated) {
        return redirect('/login');
    }

    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');

    if (!orderId) {
        return redirect('/');
    }

    // TODO: Replace with actual API call
    const mockOrder: Order = {
        id: orderId,
        items: [
            {
                id: '1',
                productId: '1',
                productName: 'Sample Product',
                quantity: 1,
                price: {
                    amount: 99.99,
                    formattedAmount: '$99.99'
                }
            }
        ],
        priceSummary: {
            subtotal: {
                amount: 99.99,
                formattedAmount: '$99.99'
            },
            shipping: {
                amount: 10,
                formattedAmount: '$10.00'
            },
            tax: {
                amount: 5,
                formattedAmount: '$5.00'
            },
            total: {
                amount: 114.99,
                formattedAmount: '$114.99'
            }
        },
        shippingInfo: {
            address: {
                addressLine1: '123 Main St',
                city: 'New York',
                state: 'NY',
                postalCode: '10001',
                country: 'USA'
            },
            contact: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            }
        },
        billingInfo: {
            address: {
                addressLine1: '123 Main St',
                city: 'New York',
                state: 'NY',
                postalCode: '10001',
                country: 'USA'
            },
            contact: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            }
        },
        status: 'processing',
        createdAt: new Date().toISOString()
    };

    return json<LoaderData>({ order: mockOrder });
}

export default function ThankYouRoute() {
    const { order } = useLoaderData<typeof loader>();

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Thank You for Your Order!</h1>
            <p className={styles.message}>
                Your order has been received and is being processed. You will receive an email
                confirmation shortly.
            </p>
            <div className={styles.orderDetails}>
                <h2 className={styles.subtitle}>Order Details</h2>
                <OrderCard order={order} />
            </div>
            <div className={styles.actions}>
                <Link to="/members-area/my-orders" className={styles.link}>
                    View All Orders
                </Link>
                <Link to="/" className={styles.link}>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
