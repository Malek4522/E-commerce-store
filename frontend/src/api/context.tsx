import { createContext, useContext, ReactNode } from 'react';
import type { ApiClient } from './types';

// Mock implementation of the API client
const mockApiClient: ApiClient = {
    getProducts: async (params?: { page?: number; limit?: number; search?: string; type?: string }) => {
        const { page = 1, limit = 10, search = '' } = params || {};
        return {
            items: [],
            total: 0
        };
    },
    getProductBySlug: async () => undefined,
    getCategories: async () => [],
    getCategoryBySlug: async () => null,
    getCart: async () => undefined,
    addToCart: async () => ({ id: '', items: [], subtotal: 0, total: 0, tax: 0 }),
    updateCartItem: async () => ({ id: '', items: [], subtotal: 0, total: 0, tax: 0 }),
    removeFromCart: async () => ({ id: '', items: [], subtotal: 0, total: 0, tax: 0 }),
    createOrder: async () => ({
        id: '',
        items: [],
        priceSummary: {
            subtotal: { amount: 0, formattedAmount: '$0' },
            shipping: { amount: 0, formattedAmount: '$0' },
            tax: { amount: 0, formattedAmount: '$0' },
            total: { amount: 0, formattedAmount: '$0' }
        },
        shippingInfo: {
            address: {
                addressLine1: '',
                city: '',
                postalCode: '',
                country: ''
            },
            contact: {
                firstName: '',
                lastName: ''
            }
        },
        billingInfo: {
            address: {
                addressLine1: '',
                city: '',
                postalCode: '',
                country: ''
            },
            contact: {
                firstName: '',
                lastName: ''
            }
        },
        status: 'pending',
        createdAt: new Date().toISOString()
    }),
    getOrder: async () => undefined,
    login: async () => ({ token: '', user: { id: '', email: '' } }),
    logout: async () => {},
    register: async () => ({ token: '', user: { id: '', email: '' } }),
    getCurrentUser: async () => undefined,
    updateUser: async () => ({ id: '', email: '' }),
    forgotPassword: async () => {},
    resetPassword: async () => {}
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