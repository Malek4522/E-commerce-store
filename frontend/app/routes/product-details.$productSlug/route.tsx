import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useProduct } from '~/src/api/products';
import { ProductDetails } from '~/src/components/product-details/product-details';
import { ProductDetailsSkeleton } from '~/src/components/product-details/product-details-skeleton';
import { type MetaFunction } from '@remix-run/react';
import styles from './styles.module.scss';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    if (!params.productSlug) {
        throw new Response('Not Found', { status: 404 });
    }
    return json({ productId: params.productSlug });
};

export default function ProductDetailsRoute() {
    const { productId } = useLoaderData<typeof loader>();
    const { data: products, isLoading, error } = useProduct(productId);
    const product = products?.[0];

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h1>Error</h1>
                <p>Failed to load product details. Please try again later.</p>
            </div>
        );
    }

    if (isLoading) {
        return <ProductDetailsSkeleton />;
    }

    if (!product) {
        return (
            <div className={styles.errorContainer}>
                <h1>Product Not Found</h1>
                <p>The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <ProductDetails 
                product={product}
                canonicalUrl={`${import.meta.env.VITE_PUBLIC_URL}/product-details/${product.id}`}
                breadcrumbs={[
                    { title: 'Home', to: '/' },
                    { title: 'Products', to: '/products/all-products' },
                    { title: product.name, to: `/product-details/${product.id}` }
                ]}
            />
        </div>
    );
}

export const meta: MetaFunction<typeof loader> = ({ data}) => {
    if (!data) {
        return [
            { title: 'Product Not Found | MZ Prestige' },
            {
                name: 'description',
                content: 'The requested product could not be found.',
            },
        ];
    }

    return [
        { title: 'Product Details | MZ Prestige' },
        {
            name: 'description',
            content: 'View product details',
        },
        {
            property: 'robots',
            content: 'index, follow',
        }
    ];
};

export { ErrorBoundary } from '~/src/components/error-page/error-page';
