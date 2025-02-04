import { ApiClient } from './types';

const isDev = import.meta.env.DEV;

export async function initializeApiForRequest(_request: Request) {
    return {
        api: createApiClient()
    };
}

// Mock API client implementation
const createApiClient = (): ApiClient => ({
    async getProducts(params?: { page?: number; limit?: number; search?: string; type?: string }) {
        const _page = params?.page ?? 1;
        const _limit = params?.limit ?? 12;
        const _search = params?.search;
        return {
            items: [],
            total: 0
        };
    },

    async getProductBySlug(_slug: string) {
        if (isDev) {
            return undefined;
        }
        return undefined;
    },

    async getCategories() {
        return [];
    },

    async getCategoryBySlug(_slug: string) {
        return null;
    },

    async createOrder(_items, _customerInfo) {
        // TODO: Replace with actual API call
        throw new Error('Not implemented');
    },

    async getOrder(_id: string, _email: string) {
        // TODO: Replace with actual API call
        return undefined;
    },

    async getOrders() {
        return { items: [], total: 0 };
    }
});