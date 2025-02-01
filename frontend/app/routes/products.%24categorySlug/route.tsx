import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useProducts } from '~/src/api/products';
import { useCategory } from '~/src/api/categories';
import { ProductGrid } from '~/src/components/product-grid/product-grid';
import { ProductsHeader } from '~/src/components/products-header/products-header';
import { ProductsSidebar } from '~/src/components/products-sidebar/products-sidebar';
import styles from './route.module.scss';

export const loader = async ({ params }: { params: { categorySlug: string } }) => {
    return json({ categorySlug: params.categorySlug });
};

export default function ProductsRoute() {
    const { categorySlug } = useLoaderData<typeof loader>();
    const { data: category } = useCategory(categorySlug);
    const { data: products, isLoading } = useProducts({ categorySlug });

    return (
        <div className={styles.root}>
            <ProductsHeader title={category?.name ?? categorySlug} />
            <div className={styles.content}>
                <ProductsSidebar />
                {category && <ProductGrid products={products ?? []} category={category} filtersApplied={false} onClickClearFilters={() => {}} />}
            </div>
        </div>
    );
} 