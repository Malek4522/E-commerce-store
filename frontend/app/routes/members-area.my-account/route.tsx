import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { User } from '~/src/api/types';
import { initializeApiForRequest, getUserFromSession } from '~/src/api/session';
import styles from './route.module.scss';

interface LoaderData {
    user: User;
}

export async function loader({ request }: LoaderFunctionArgs) {
    const { isAuthenticated } = await initializeApiForRequest(request);
    if (!isAuthenticated) {
        throw new Response('Not authenticated', { status: 401 });
    }

    const user = await getUserFromSession(request);
    if (!user) {
        throw new Response('User not found', { status: 404 });
    }

    return json<LoaderData>({ user });
}

export default function MyAccountRoute() {
    const { user } = useLoaderData<typeof loader>();

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>My Account</h1>
            <div className={styles.content}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Personal Information</h2>
                    <div className={styles.info}>
                        <div className={styles.field}>
                            <div className={styles.label}>Name</div>
                            <div className={styles.value}>
                                {user.firstName} {user.lastName}
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.label}>Email</div>
                            <div className={styles.value}>{user.email}</div>
                        </div>
                        {user.phone && (
                            <div className={styles.field}>
                                <div className={styles.label}>Phone</div>
                                <div className={styles.value}>{user.phone}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
