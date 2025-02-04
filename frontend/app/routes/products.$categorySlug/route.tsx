import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { type MetaFunction, useLoaderData } from '@remix-run/react';
import classNames from 'classnames';
import { useEffect, useState, useCallback } from 'react';
import { AppliedProductFilters } from '~/src/components/applied-product-filters/applied-product-filters';
import { Breadcrumbs } from '~/src/components/breadcrumbs/breadcrumbs';
import { RouteBreadcrumbs, useBreadcrumbs } from '~/src/components/breadcrumbs/use-breadcrumbs';
import { CategoryLink } from '~/src/components/category-link/category-link';
import { ProductGrid } from '~/src/components/product-grid/product-grid';
import { ProductSortingSelect } from '~/src/components/product-sorting-select/product-sorting-select';
import { toast } from '~/src/components/toast/toast';
import { initializeApiForRequest } from '~/src/api/session';
import { Category, Product } from '~/src/api/types';
import { getErrorMessage } from '~/src/utils';
import { useFilters } from '~/src/hooks/use-filters';
import { useLocalSorting } from '~/src/hooks/use-local-sorting';

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
    const { api } = await initializeApiForRequest(request);

    const categories: Category[] = [
        { id: 'all-products', name: 'All Products', slug: 'all-products', description: 'Browse all our products' },
        { id: 'jumpsuit', name: 'Jumpsuit', slug: 'jumpsuit', description: 'Browse our jumpsuit collection', type: 'Jumpsuit' },
        { id: 'robe', name: 'Robe', slug: 'robe', description: 'Browse our robe collection', type: 'Robe' },
        { id: 'jupe', name: 'Jupe', slug: 'jupe', description: 'Browse our jupe collection', type: 'Jupe' },
        { id: 'new-in', name: 'New In', slug: 'new-in', description: 'Browse our latest arrivals' },
        { id: 'sale', name: 'Sale', slug: 'sale', description: 'Browse our sale items' }
    ];

    const categorySlug = params.categorySlug;
    if (!categorySlug) {
        throw new Response('Bad Request', { status: 400 });
    }

    const category = categories.find(c => c.slug === categorySlug);
    if (!category) {
        throw new Response('Category not found', { status: 404 });
    }

    let products: Product[] = [];

    try {
        // Get products based on category
        const searchParams = new URLSearchParams(new URL(request.url).search);
        const response = await api.getProducts({
            type: category.slug === 'all-products' ? undefined : (category as any).type,
            search: searchParams.get('search') || undefined,
            page: Number(searchParams.get('page')) || 1,
            limit: 12
        });

        if (!response || !response.items) {
            throw new Error('Invalid API response');
        }

        products = response.items;

        if (!Array.isArray(products)) {
            throw new Error('Invalid products data');
        }

        // Calculate price range from available products
        const prices = products.map(product => 
            typeof product.price === 'object' && product.price.amount 
                ? product.price.amount 
                : typeof product.price === 'number' 
                    ? product.price 
                    : 0
        ).filter(price => typeof price === 'number' && !isNaN(price));

        const priceRange = {
            min: prices.length ? Math.min(...prices) : 0,
            max: prices.length ? Math.max(...prices) : 0
        };

        return json<LoaderData>({
            category,
            products,
            totalProducts: response.total,
            categories,
            priceRange
        });
    } catch (error) {
        toast.error('Error loading products: ' + (error instanceof Error ? error.message : 'Unknown error'));
        throw new Response(
            error instanceof Error ? error.message : 'Failed to load products',
            { 
                status: 500,
                statusText: error instanceof Error ? error.message : 'Internal Server Error'
            }
        );
    }
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
    const { sorting, setSorting, sortProducts } = useLocalSorting();
    const breadcrumbs = useBreadcrumbs();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `${import.meta.env.VITE_API_URL}/product`;
                if (category.slug === 'new-in') {
                    url = `${import.meta.env.VITE_API_URL}/product/new`;
                } else if (category.slug === 'sale') {
                    url = `${import.meta.env.VITE_API_URL}/product/sale`;
                } else {
                    url = `${import.meta.env.VITE_API_URL}/product/${category.slug}`;
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const { data } = await response.json();
                
                // Transform the data to match frontend expectations
                const transformedProducts = data.map((product: {
                    _id: string;
                    name: string;
                    price: number;
                    soldPrice: number;
                    links: Array<{
                        id: string;
                        url: string;
                        type: 'image' | 'video';
                    }>;
                }) => ({
                    id: product._id,
                    name: product.name,
                    price: {
                        amount: product.price,
                        formatted: `${product.price.toLocaleString()} DA`,
                        soldPrice: product.soldPrice,
                        soldPriceFormatted: product.soldPrice ? `${product.soldPrice.toLocaleString()} DA` : undefined
                    },
                    images: product.links
                        .filter(link => link.type === 'image')
                        .map(link => ({
                            id: link.id,
                            url: link.url,
                            altText: product.name
                        }))
                })) as Product[];

                // Sort the products before setting them
                const sortedProducts = sortProducts(transformedProducts, sorting);
                setProducts(sortedProducts);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to fetch products');
            }
        };
        
        fetchProducts();
    }, [category, sorting]);

    const loadMoreProducts = useCallback(async () => {
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
    }, [currentPage, category.id, filters, products]);

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
                            {products.length} {products.length === 1 ? 'product' : 'products'}
                        </p>

                        <ProductSortingSelect value={sorting} onChange={setSorting} />
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
        { title: `${data?.category.name ?? 'Products'} | MZ Prestige` },
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
