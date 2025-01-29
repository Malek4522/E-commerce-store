import type { MetaFunction } from '@remix-run/react';
import styles from './route.module.scss';

export default function AdminOrders() {
    return (
        <div className={styles.ordersPage}>
            <header className={styles.header}>
                <h1>Orders Management</h1>
            </header>
            <div className={styles.content}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    Loading orders...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Orders Management - ReClaim Admin' },
        {
            name: 'description',
            content: 'Manage orders in ReClaim store',
        },
    ];
}; 