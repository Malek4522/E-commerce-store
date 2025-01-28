import { SerializeFrom } from '@remix-run/node';
import { useEffect, useRef, useState } from 'react';
import { IProductFilters, Product, ProductSortBy, useEcomApi } from '../ecom';

export interface ProductsPageResults {
    items: (Product | SerializeFrom<Product>)[];
    totalCount: number;
}

export interface UseProductsPageResultsArgs {
    categoryId: string;
    filters: IProductFilters;
    sorting: ProductSortBy;
    resultsFromLoader: ProductsPageResults;
}

/**
 * Returns the list of products displayed on the products page.
 *
 * @param resultsFromLoader The initial batch of results obtained from the route loader,
 * to avoid redundant fetching on the client side.
 */
export function useProductsPageResults({
    categoryId,
    filters,
    sorting,
    resultsFromLoader,
}: UseProductsPageResultsArgs) {
    const [results, setResults] = useState(resultsFromLoader);
    const resultsRef = useRef(results);
    resultsRef.current = results;

    // When the category or filters change, the loader fetches the first batch of new
    // results without a full-page reload, and we need to reset the list of results.
    useEffect(() => {
        setError(undefined);
        setResults(resultsFromLoader);
    }, [resultsFromLoader]);

    const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);
    const [error, setError] = useState<unknown>();

    const ecomApi = useEcomApi();

    const loadMoreProducts = async () => {
        const resultsBeforeFetch = resultsRef.current;
        setIsLoadingMoreProducts(true);

        try {
            const response = await ecomApi.getProducts({
                categoryId,
                filters,
                sortBy: sorting,
                skip: results.items.length,
            });

            if (resultsRef.current === resultsBeforeFetch) {
                setError(undefined);
                setResults((prev) => ({
                    totalCount: response.totalCount,
                    items: [...prev.items, ...response.items],
                }));
            }
        } catch (error) {
            setError(error);
        } finally {
            setIsLoadingMoreProducts(false);
        }
    };

    return {
        products: results.items,
        totalProducts: results.totalCount,
        isLoadingMoreProducts,
        loadMoreProducts,
        error,
    };
}
