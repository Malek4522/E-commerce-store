import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { type MetaFunction, useLoaderData } from '@remix-run/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { AppliedProductFilters } from '~/src/components/applied-product-filters/applied-product-filters';
import { Breadcrumbs } from '~/src/components/breadcrumbs/breadcrumbs';
import { RouteBreadcrumbs, useBreadcrumbs } from '~/src/components/breadcrumbs/use-breadcrumbs';
import { CategoryLink } from '~/src/components/category-link/category-link';
import { ProductGrid } from '~/src/components/product-grid/product-grid';
import { ProductSortingSelect } from '~/src/components/product-sorting-select/product-sorting-select';
import { toast } from '~/src/components/toast/toast';
import { initializeApiForRequest } from '~/src/api/session';
import { Category, Product, ProductFilters, ProductSortBy } from '~/src/api/types';
import { getErrorMessage } from '~/src/utils';
import { useFilters } from '~/src/hooks/use-filters';
import { useSorting } from '~/src/hooks/use-sorting';

import styles from './route.module.scss';

interface LoaderData {
    category: Category;
    products: Product[];
    totalProducts: number;
    categories: Category[];
    priceRange: {
        min: number;
        max: number;
    };
}

export async function loader({ params, request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const { categorySlug } = params;

    if (!categorySlug) {
        throw new Response('Bad Request', { status: 400 });
    }

    const { api } = await initializeApiForRequest(request);
    const category = await api.getCategoryBySlug(categorySlug);

    if (!category) {
        throw new Response('Category Not Found', { status: 404 });
    }

    const searchParams = new URLSearchParams(url.search);
    const filters: ProductFilters = {
        categories: [category.id],
        search: searchParams.get('search') || undefined,
        price: {
            min: Number(searchParams.get('minPrice')) || 0,
            max: Number(searchParams.get('maxPrice')) || Infinity
        }
    };

    const sortBy = (searchParams.get('sortBy') as ProductSortBy) || ProductSortBy.NAME_ASC;
    const page = Number(searchParams.get('page')) || 1;
    const limit = 12;

    const [productsResponse, categories] = await Promise.all([
        api.getProducts({ page, limit, ...filters }),
        api.getCategories()
    ]);

    // Calculate price range from available products
    const prices = productsResponse.items.map(product => product.price.amount);
    const priceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };

    return json<LoaderData>({
        category,
        products: productsResponse.items,
        totalProducts: productsResponse.total,
        categories,
        priceRange
    });
}

const breadcrumbs: RouteBreadcrumbs<typeof loader> = (match) => [
    {
        title: match.data.category.name,
        to: `/products/${match.data.category.slug}`,
    },
];

export const handle = {
    breadcrumbs,
};

export default function ProductsRoute() {
    const {
        category,
        products: initialProducts,
        totalProducts,
        categories,
        priceRange
    } = useLoaderData<typeof loader>();

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { filters, someFiltersApplied, clearFilter, clearAllFilters } = useFilters();
    const { sorting } = useSorting();

    const breadcrumbs = useBreadcrumbs();

    const loadMoreProducts = async () => {
        try {
            setIsLoadingMore(true);
            const nextPage = currentPage + 1;
            const { api } = await initializeApiForRequest(new Request(window.location.href));
            const response = await api.getProducts({
                page: nextPage,
                limit: 12,
                categories: [category.id],
                ...filters
            });
            setProducts([...products, ...response.items]);
            setCurrentPage(nextPage);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <div className={styles.page}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className={styles.content}>
                <div className={styles.sidebar}>
                    <nav className={styles.nav1}>
                        <h2 className={styles.sidebarTitle}>Browse by</h2>
                        <ul className={styles.categoryList}>
                            {categories.map((cat) => (
                                <li key={cat.id} className={styles.categoryListItem}>
                                    <CategoryLink
                                        categorySlug={cat.slug}
                                        className={({ isActive }) =>
                                            classNames(styles.categoryLink, {
                                                [styles.categoryLinkActive]: isActive,
                                            })
                                        }
                                    >
                                        {cat.name}
                                    </CategoryLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className={styles.main}>
                    <div className={styles.categoryHeader}>
                        <h1 className={styles.categoryName}>
                            {filters.search ? `"${filters.search}"` : category.name}
                        </h1>
                        {category.description && !filters.search && (
                            <p className={styles.categoryDescription}>{category.description}</p>
                        )}
                    </div>

                    {someFiltersApplied && (
                        <AppliedProductFilters
                            className={styles.appliedFilters}
                            filters={filters}
                            onClearFilter={clearFilter}
                            onClearAllFilters={clearAllFilters}
                            priceRange={priceRange}
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
                                disabled={isLoadingMore}
                            >
                                {isLoadingMore ? 'Loading...' : 'Load More'}
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
        { title: `${data?.category.name ?? 'Products'} | ReClaim` },
        {
            name: 'description',
            content: data?.category.description ?? 'Browse our products',
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
    ];
};

export { ErrorBoundary } from '~/src/components/error-page/error-page';
