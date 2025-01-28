import useSwr, { SWRResponse } from 'swr';
import { GetProductsOptions, Product, useEcomApi } from '../ecom';

export function useProducts(
    options: GetProductsOptions,
): SWRResponse<{ items: Product[]; totalCount: number }> {
    const ecomApi = useEcomApi();
    return useSwr(['products', options], async ([, options]) => ecomApi.getProducts(options), {
        keepPreviousData: false,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    });
}
