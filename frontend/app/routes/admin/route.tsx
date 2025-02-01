import { Outlet } from '@remix-run/react';
import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';
import styles from './route.module.scss';

export default function AdminLayout() {
    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin Dashboard</h2>
                </div>
                <nav className={styles.sidebarNav}>
                    <Link
                        to="/admin/products"
                        className={styles.navLink}
                    >
                        Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        className={styles.navLink}
                    >
                        Orders
                    </Link>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Admin Dashboard - ReClaim' },
        {
            name: 'description',
            content: 'Admin dashboard for ReClaim store',
        },
        {
            property: 'robots',
            content: 'noindex, nofollow',
        },
    ];
}; 