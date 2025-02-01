import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import styles from './error-page.module.scss';

export function ErrorBoundary() {
    const error = useRouteError();
    
    let errorMessage = 'An unexpected error occurred';
    let stackTrace = '';
    
    if (isRouteErrorResponse(error)) {
        errorMessage = error.data || error.statusText;
    } else if (error instanceof Error) {
        errorMessage = error.message;
        stackTrace = error.stack || '';
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = JSON.stringify(error, null, 2);
    }

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Error</h1>
            <pre className={styles.message}>{errorMessage}</pre>
            {stackTrace && (
                <details className={styles.details}>
                    <summary>Error Details</summary>
                    <pre className={styles.stack}>{stackTrace}</pre>
                </details>
            )}
            {import.meta.env.DEV && (
                <details className={styles.details}>
                    <summary>Full Error Object</summary>
                    <pre className={styles.stack}>
                        {JSON.stringify(error, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}
