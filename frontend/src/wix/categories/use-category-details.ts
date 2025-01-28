import useSwr, { SWRResponse } from 'swr';
import { useEcomApi, type CollectionDetails } from '../ecom';

export function useCategoryDetails(slug: string): SWRResponse<CollectionDetails | undefined> {
    const ecomApi = useEcomApi();
    return useSwr(['category-details', slug], async ([, slug]) => ecomApi.getCategoryBySlug(slug), {
        keepPreviousData: false,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    });
}
