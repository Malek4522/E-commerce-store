import { useState, useEffect } from 'react';
import { Product, InventoryStatus } from './types';

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
        // TODO: Replace with actual API call
        const mockProducts: Product[] = [
            {
                id: '1',
                name: 'Sample Product',
                slug: 'sample-product',
                description: 'A sample product description',
                price: {
                    amount: 99.99,
                    formatted: '$99.99',
                    discountedAmount: 79.99,
                    discountedFormatted: '$79.99'
                },
                images: [
                    {
                        id: '1',
                        url: 'https://i.ibb.co/KxQwXNM9/a.jpg',
                        altText: 'Sample product image'
                    }
                ],
                categoryId: '1',
                ribbon: 'New',
                stock: 10,
                inventoryStatus: 'IN_STOCK'
            }
        ];

        setData(mockProducts);
        setIsLoading(false);
    }, [categorySlug, limit]);

    return { data, isLoading, error };
}

export function useProduct(slug: string): UseProductsResult {
    const [data, setData] = useState<Product[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // TODO: Replace with actual API call
        const mockProduct: Product = {
            id: '1',
            name: 'Sample Product',
            slug: 'sample-product',
            description: 'A sample product description',
            price: {
                amount: 99.99,
                formatted: '$99.99',
                discountedAmount: 79.99,
                discountedFormatted: '$79.99'
            },
            images: [
                {
                    id: '1',
                    url: 'https://i.ibb.co/KxQwXNM9/a.jpg',
                    altText: 'Sample product image'
                }
            ],
            categoryId: '1',
            ribbon: 'New',
            stock: 10,
            inventoryStatus: 'IN_STOCK'
        };

        setData([mockProduct]);
        setIsLoading(false);
    }, [slug]);

    return { data: data?.[0] ? [data[0]] : undefined, isLoading, error };
}