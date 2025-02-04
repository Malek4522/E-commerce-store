import { useState } from 'react';
import { ProductSortBy } from '~/src/api/product-filters';

export function useLocalSorting() {
    const [sorting, setSorting] = useState<ProductSortBy>(ProductSortBy.NAME_ASC);

    const sortProducts = <T extends { name: string; price: { amount: number } }>(
        products: T[],
        sortBy: ProductSortBy
    ): T[] => {
        const sortedProducts = [...products];
        
        switch (sortBy) {
            case ProductSortBy.NAME_ASC:
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case ProductSortBy.NAME_DESC:
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case ProductSortBy.PRICE_ASC:
                sortedProducts.sort((a, b) => a.price.amount - b.price.amount);
                break;
            case ProductSortBy.PRICE_DESC:
                sortedProducts.sort((a, b) => b.price.amount - a.price.amount);
                break;
        }
        
        return sortedProducts;
    };

    return {
        sorting,
        setSorting,
        sortProducts
    };
} 