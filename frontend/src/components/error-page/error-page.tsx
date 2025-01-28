import { isRouteErrorResponse, useNavigate, useNavigation, useRouteError } from '@remix-run/react';
import { FC, useEffect } from 'react';
import { getErrorMessage } from '~/src/wix/utils';

import styles from './error-page.module.scss';

export interface ErrorPageProps {
    title: string;
    message?: string;
    actionButtonText?: string;
    onActionButtonClick?: () => void;
}

export const ErrorPage: FC<ErrorPageProps> = ({
    title,
    message,
    actionButtonText,
    onActionButtonClick,
}) => {
    return (
        <div className={styles.root}>
            <h1 className={styles.title}>{title}</h1>
            {message && <div className={styles.message}>{message}</div>}
            {actionButtonText ? (
                <button className="button primaryButton" onClick={onActionButtonClick}>
                    {actionButtonText}
                </button>
            ) : null}
        </div>
    );
};

export const ErrorBoundary = () => {
    const error = useRouteError();
    const navigation = useNavigation();
    const navigate = useNavigate();

    let title = 'Something Went Wrong';
    let message = getErrorMessage(error);

    if (isRouteErrorResponse(error) && error.status === 404) {
        title = 'Page Not Found';
        message = '';
    }

    // In Remix dev mode, if an error bubbles up from a child route to a parent
    // route's error boundary, and the user then follows a link, some style tags
    // disappear. To prevent this, we force a full page load upon navigation
    // from the error boundary.
    useEffect(() => {
        if (import.meta.env.MODE === 'development' && navigation.state === 'loading') {
            const { pathname, search, hash } = navigation.location;
            window.location.assign(pathname + search + hash);
        }
    }, [navigation]);

    return (
        <ErrorPage
            title={title}
            message={message}
            actionButtonText="Back to shopping"
            onActionButtonClick={() => navigate('/products/all-products')}
        />
    );
};
