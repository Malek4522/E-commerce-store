import { Outlet } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';
import styles from './route.module.scss';

export default function AdminLayout() {
    return (
        <div className={styles.adminLayout}>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Admin Dashboard - MZ Prestige' },
        {
            name: 'description',
            content: 'Admin dashboard for MZ Prestige store',
        },
    ];
}; 