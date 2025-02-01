import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Order } from '~/src/api/types';
import { initializeApiForRequest } from '~/src/api/session';
import { OrderCard } from '~/src/components/order-card/order-card';
import styles from './route.module.scss';

interface LoaderData {
    orders: Order[];
}

export async function loader({ request }: LoaderFunctionArgs) {
    const { isAuthenticated } = await initializeApiForRequest(request);
    if (!isAuthenticated) {
        throw new Response('Not authenticated', { status: 401 });
    }

    // TODO: Replace with actual API call
    const mockOrders: Order[] = [
        {
            id: '1',
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
            status: 'completed',
            createdAt: new Date().toISOString()
        }
    ];

    return json<LoaderData>({ orders: mockOrders });
}

export default function MyOrdersRoute() {
    const { orders } = useLoaderData<typeof loader>();

    if (!orders.length) {
        return (
            <div className={styles.empty}>
                <h1 className={styles.title}>My Orders</h1>
                <p>You haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>My Orders</h1>
            <div className={styles.orders}>
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}
