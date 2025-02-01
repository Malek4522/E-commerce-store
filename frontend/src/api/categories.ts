import { useState, useEffect } from 'react';
import { Category } from './types';

interface UseCategoryResult {
    data: Category | undefined;
    isLoading: boolean;
    error: Error | null;
}

export function useCategory(slug: string): UseCategoryResult {
    const [data, setData] = useState<Category>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // TODO: Replace with actual API call
        const mockCategory: Category = {
            id: '1',
            name: 'Sample Category',
            slug: 'sample-category',
            description: 'A sample category description'
        };

        setData(mockCategory);
        setIsLoading(false);
    }, [slug]);

    return { data, isLoading, error };
} 