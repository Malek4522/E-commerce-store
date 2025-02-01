import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useProduct } from '~/src/api/products';
import { ProductDetails } from '~/src/components/product-details/product-details';
import { ProductImages } from '~/src/components/product-images/product-images';
import styles from './product-details.module.scss';

export const loader = async ({ params }: { params: { productSlug: string } }) => {
    return json({ productSlug: params.productSlug });
};

export default function ProductDetailsRoute() {
    const { productSlug } = useLoaderData<typeof loader>();
    const { data: product, isLoading } = useProduct(productSlug);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <ProductImages images={product.images} mainImage={product.images[0]} />
                <ProductDetails product={product} />
            </div>
        </div>
    );
}