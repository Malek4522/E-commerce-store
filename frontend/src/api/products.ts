import { useState, useEffect } from 'react';
import type { Product } from './types';
import { mapBackendProductToFrontend } from './product-mapper';

const API_URL = import.meta.env.VITE_API_URL;

interface UseProductsOptions {
    categorySlug?: string;
    limit?: number;
}

interface UseProductsResult {
    data: Product[] | undefined;
    isLoading: boolean;
    error: Error | null;
}

export function useProducts({ categorySlug, limit }: UseProductsOptions = {}): UseProductsResult {
    const [data, setData] = useState<Product[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const abortController = new AbortController();
        let isMounted = true;

        async function fetchProducts() {
            try {
                let url = `${API_URL}/product`;
                if (categorySlug === 'new-in') {
                    url = `${API_URL}/product/new`;
                } else if (categorySlug === 'sold') {
                    url = `${API_URL}/product/sale`;
                }

                const response = await fetch(url, {
                    signal: abortController.signal
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const { data: products } = await response.json();
                if (isMounted) {
                    setData(products.map(mapBackendProductToFrontend));
                    setError(null);
                }
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return;
                }
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('Failed to fetch products'));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchProducts();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [categorySlug, limit]);

    return { data, isLoading, error };
}

export function useProduct(slug: string): UseProductsResult {
    const [data, setData] = useState<Product[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`${API_URL}/product/${slug}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }

                const { data: product } = await response.json();
                setData([mapBackendProductToFrontend(product)]);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch product'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, [slug]);

    return { data, isLoading, error };
}