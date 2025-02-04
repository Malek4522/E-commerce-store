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
                <h1>Erreur</h1>
                <p>Échec du chargement des détails du produit. Veuillez réessayer plus tard.</p>
            </div>
        );
    }

    if (isLoading) {
        return <ProductDetailsSkeleton />;
    }

    if (!product) {
        return (
            <div className={styles.errorContainer}>
                <h1>Produit Non Trouvé</h1>
                <p>Le produit que vous recherchez n&apos;existe pas ou a été supprimé.</p>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <ProductDetails 
                product={product}
                canonicalUrl={`${import.meta.env.VITE_PUBLIC_URL}/product-details/${product.id}`}
                breadcrumbs={[
                    { title: 'Accueil', to: '/' },
                    { title: 'Produits', to: '/products/all-products' },
                    { title: product.name, to: `/product-details/${product.id}` }
                ]}
            />
        </div>
    );
}

export const meta: MetaFunction<typeof loader> = ({ data}) => {
    if (!data) {
        return [
            { title: 'Produit Non Trouvé | MZ Prestige' },
            {
                name: 'description',
                content: 'Le produit demandé est introuvable.',
            },
        ];
    }

    return [
        { title: 'Détails du Produit | MZ Prestige' },
        {
            name: 'description',
            content: 'Voir les détails du produit',
        },
        {
            property: 'robots',
            content: 'index, follow',
        }
    ];
};

export { ErrorBoundary } from '~/src/components/error-page/error-page';
