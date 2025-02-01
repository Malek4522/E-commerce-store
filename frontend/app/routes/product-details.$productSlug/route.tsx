import { LoaderFunctionArgs, json } from '@remix-run/node';
import { type MetaFunction, useLoaderData, useNavigation } from '@remix-run/react';
import { ProductDetails } from '../../../src/components/product-details/product-details';
import { initializeApiForRequest } from '../../../src/api/session';
import { BreadcrumbData } from '../../../src/components/breadcrumbs/breadcrumbs';
import { useBreadcrumbs } from '../../../src/components/breadcrumbs/use-breadcrumbs';

let requestCount = 0;

// Server-side code
export async function loader({ request, params }: LoaderFunctionArgs) {
    try {
        // Track request count to detect infinite loops
        requestCount++;
        
        if (requestCount > 5) {
            throw new Error('Potential infinite loop detected - loader called too many times');
        }

        const { api } = await initializeApiForRequest(request);
        const product = await api.getProductBySlug(params.productSlug!);

        if (!product) {
            throw new Error(`Product not found: ${params.productSlug}`);
        }

        const url = new URL(request.url);
        url.search = '';

        return json({ 
            product,
            canonicalUrl: url.toString()
        });
    } catch (error) {
        console.error('Error in product details loader:', error);
        throw error;
    }
}

interface ProductDetailsLocationState {
    fromCategory?: {
        name: string;
        slug: string;
    };
}

// Client-side code
export const handle = {
    breadcrumbs: (data: { product?: { name: string; slug: string } }) => {
        try {
            if (!data?.product) {
                return [{
                    title: 'Product Details',
                    to: '/product-details'
                }];
            }
            return [{
                title: data.product.name,
                to: `/product-details/${data.product.slug}`
            }];
        } catch (error) {
            console.error('Error generating breadcrumbs:', error);
            return [{
                title: 'Product Details',
                to: '/product-details'
            }];
        }
    }
};

export default function ProductDetailsRoute() {
    const data = useLoaderData<typeof loader>();
    const breadcrumbs = useBreadcrumbs();
    const navigation = useNavigation();
    
    if (navigation.state === 'loading') {
        return <div>Loading...</div>;
    }
    
    if (!data || !data.product) {
        throw new Response('Product Not Found', { status: 404 });
    }
    
    return (
        <ProductDetails 
            key={data.product.id}
            product={data.product}
            canonicalUrl={data.canonicalUrl}
            breadcrumbs={breadcrumbs}
        />
    );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data || !data.product) {
        return [
            { title: 'Product Not Found | ReClaim' },
            {
                name: 'description',
                content: 'The requested product could not be found.',
            },
        ];
    }

    const title = `${data.product.name} | ReClaim`;
    const description = data.product.description;

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
            content: data.product.images[0]?.url ?? '/social-media-image.jpg',
        },
    ];
};

export { ErrorBoundary } from '~/src/components/error-page/error-page';
