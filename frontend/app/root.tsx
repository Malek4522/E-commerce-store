import '~/src/styles/reset.scss';
import '~/src/styles/colors.scss';
import '~/src/styles/typography.scss';
import '~/src/styles/global.scss';
import '~/src/styles/utils.scss';

import { json, LoaderFunctionArgs } from '@remix-run/node';
import {
    Links,
    Meta,
    type MetaFunction,
    Outlet,
    Scripts,
    ScrollRestoration,
    LiveReload,
} from '@remix-run/react';
import { RouteBreadcrumbs } from '~/src/components/breadcrumbs/use-breadcrumbs';
import { Footer } from '~/src/components/footer/footer';
import { Header } from '~/src/components/header/header';
import { NavigationProgressBar } from '~/src/components/navigation-progress-bar/navigation-progress-bar';
import { Toaster } from '~/src/components/toaster/toaster';
import { ApiProvider } from '~/src/api';

import styles from './root.module.scss';

export async function loader({ request: _request }: LoaderFunctionArgs) {
    return json({});
}

const breadcrumbs: RouteBreadcrumbs = () => [{ title: 'Home', to: '/' }];

export const handle = {
    breadcrumbs,
};

export function Layout({ children: _children }: React.PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <ApiProvider>
                    <div>
                        <div className={styles.root}>
                            <Header />
                            <main className={styles.main}>
                                {_children}
                            </main>
                            <Footer />
                        </div>
                        <NavigationProgressBar className={styles.navigationProgressBar} />
                        <Toaster />
                    </div>
                </ApiProvider>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export const meta: MetaFunction = () => {
    const title = 'MZ boutique : Home Goods Store';
    const description = 'Essential home products for sustainable living';

    return [
        { title },
        {
            name: 'description',
            content: description,
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
        {
            property: 'og:title',
            content: title,
        },
        {
            property: 'og:description',
            content: description,
        },
        {
            property: 'og:image',
            content: '/social-media-image.jpg',
        },
    ];
};

export { ErrorBoundary } from '~/src/components/error-page/error-page';
