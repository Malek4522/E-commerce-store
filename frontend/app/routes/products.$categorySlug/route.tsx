import type { LoaderFunctionArgs } from '@remix-run/node';
import { type MetaFunction, useLoaderData } from '@remix-run/react';
import type { GetStaticRoutes } from '@wixc3/define-remix-app';
import classNames from 'classnames';
import { useEffect } from 'react';
import { AppliedProductFilters } from '~/src/components/applied-product-filters/applied-product-filters';
import { Breadcrumbs } from '~/src/components/breadcrumbs/breadcrumbs';
import { RouteBreadcrumbs, useBreadcrumbs } from '~/src/components/breadcrumbs/use-breadcrumbs';
import { CategoryLink } from '~/src/components/category-link/category-link';
import { ProductGrid } from '~/src/components/product-grid/product-grid';
import { ProductSortingSelect } from '~/src/components/product-sorting-select/product-sorting-select';
import { toast } from '~/src/components/toast/toast';
import { initializeEcomApiAnonymous } from '~/src/wix/ecom';
import { initializeEcomApiForRequest } from '~/src/wix/ecom/session';
import {
    productFiltersFromSearchParams,
    productSortByFromSearchParams,
    useAppliedProductFilters,
    useProductSorting,
    useProductsPageResults,
} from '~/src/wix/products';
import { getErrorMessage } from '~/src/wix/utils';

import styles from './route.module.scss';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const { categorySlug } = params;

    if (!categorySlug) {
        throw new Response('Bad Request', { status: 400 });
    }

    const api = await initializeEcomApiForRequest(request);
    const filters = productFiltersFromSearchParams(url.searchParams);
    const sortBy = productSortByFromSearchParams(url.searchParams);
    const category = await api.getCategoryBySlug(categorySlug);

    if (!category) {
        throw new Response('Category Not Found', { status: 404 });
    }

    const [categoryProducts, allCategories, productPriceBounds] = await Promise.all([
        api.getProducts({ categoryId: category._id!, filters, sortBy }),
        api.getAllCategories(),
        api.getProductPriceBoundsInCategory(category._id!),
    ]);

    return { category, categoryProducts, allCategories, productPriceBounds };
};

const breadcrumbs: RouteBreadcrumbs<typeof loader> = (match) => [
    {
        title: match.data.category.name!,
        to: `/products/${match.data.category.slug}`,
    },
];

export const getStaticRoutes: GetStaticRoutes = async () => {
    const api = initializeEcomApiAnonymous();
    const categories = await api.getAllCategories();
    return categories.map((category) => `/products/${category.slug}`);
};

export const handle = {
    breadcrumbs,
};

export default function ProductsPage() {
    const {
        category,
        categoryProducts: resultsFromLoader,
        allCategories,
        productPriceBounds,
    } = useLoaderData<typeof loader>();

    const { appliedFilters, someFiltersApplied, clearFilters, clearAllFilters } =
        useAppliedProductFilters();

    const { sorting } = useProductSorting();

    const { products, totalProducts, loadMoreProducts, isLoadingMoreProducts, error } =
        useProductsPageResults({
            categoryId: category._id!,
            filters: appliedFilters,
            sorting,
            resultsFromLoader,
        });

    const currency = products[0]?.priceData?.currency ?? 'USD';

    const breadcrumbs = useBreadcrumbs();

    useEffect(() => {
        if (error) toast.error(getErrorMessage(error));
    }, [error]);

    return (
        <div className={styles.page}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className={styles.content}>
                <div className={styles.sidebar}>
                    <nav className={styles.nav1}>
                        <h2 className={styles.sidebarTitle}>Browse by</h2>
                        <ul className={styles.categoryList}>
                            {allCategories.map((category) => (
                                <li key={category._id} className={styles.categoryListItem}>
                                    <CategoryLink
                                        categorySlug={category.slug!}
                                        className={({ isActive }) =>
                                            classNames(styles.categoryLink, {
                                                [styles.categoryLinkActive]: isActive,
                                            })
                                        }
                                    >
                                        {category.name}
                                    </CategoryLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className={styles.main}>
                    <div className={styles.categoryHeader}>
                        <h1 className={styles.categoryName}>
                            {appliedFilters.search ? `"${appliedFilters.search}"` : category.name}
                        </h1>
                        {category.description && !appliedFilters.search && (
                            <p className={styles.categoryDescription}>{category.description}</p>
                        )}
                    </div>

                    {someFiltersApplied && (
                        <AppliedProductFilters
                            className={styles.appliedFilters}
                            appliedFilters={appliedFilters}
                            onClearFilters={clearFilters}
                            onClearAllFilters={clearAllFilters}
                            currency={currency}
                            minPriceInCategory={productPriceBounds.lowest}
                            maxPriceInCategory={productPriceBounds.highest}
                        />
                    )}

                    <div className={styles.countAndSorting}>
                        <p className={styles.productsCount}>
                            {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
                        </p>

                        <ProductSortingSelect />
                    </div>

                    <ProductGrid
                        products={products}
                        category={category}
                        filtersApplied={someFiltersApplied}
                        onClickClearFilters={clearAllFilters}
                    />

                    {products.length < totalProducts && (
                        <div className={styles.loadMoreWrapper}>
                            <button
                                className="button secondaryButton"
                                onClick={loadMoreProducts}
                                disabled={isLoadingMoreProducts}
                            >
                                {isLoadingMoreProducts ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: `${data?.category.name ?? 'ReClaim: Products'} | ReClaim` },
        {
            name: 'description',
            content: data?.category.description,
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
    ];
};

export { ErrorBoundary } from '~/src/components/error-page/error-page';
