import { createContext, useContext, ReactNode } from 'react';
import type { ApiClient, OrderItem, CustomerInfo } from './types';

// Mock implementation of the API client
const mockApiClient: ApiClient = {
    getProducts: async (params?: { page?: number; limit?: number; search?: string; type?: string }) => {
        const { page: _page = 1, limit: _limit = 10, search: _search = '' } = params || {};
        return {
            items: [],
            total: 0
        };
    },
    getProductBySlug: async () => undefined,
    getCategories: async () => [],
    getCategoryBySlug: async () => null,
    getOrders: async () => ({ items: [], total: 0 }),
    getOrder: async () => undefined,
    createOrder: async (items: OrderItem[], customerInfo: CustomerInfo) => ({
        id: '',
        createdAt: new Date().toISOString(),
        status: 'pending' as const,
        items: [],
        priceSummary: {
            subtotal: { amount: 0, formattedAmount: '$0' },
            shipping: { amount: 0, formattedAmount: '$0' },
            tax: { amount: 0, formattedAmount: '$0' },
            total: { amount: 0, formattedAmount: '$0' }
        },
        shippingInfo: customerInfo.shippingInfo,
        billingInfo: customerInfo.billingInfo,
    })
};

const ApiContext = createContext<ApiClient>(mockApiClient);

export function ApiProvider({ children }: { children: ReactNode }) {
    return (
        <ApiContext.Provider value={mockApiClient}>
            {children}
        </ApiContext.Provider>
    );
}

export function useApi() {
    return useContext(ApiContext);
} 