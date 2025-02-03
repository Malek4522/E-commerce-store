import { ApiClient, User, Product } from './types';

const isDev = import.meta.env.DEV;

// Mock data


// Mock API client implementation
const createApiClient = (token?: string): ApiClient => ({
    async getProducts(params?: { page?: number; limit?: number; search?: string; type?: string }) {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 12;
        const search = params?.search;
        // TODO: Replace with actual API call
        return {
            items: [],
            total: 0
        };
    },

    async getProductBySlug(slug: string) {
        // Return mock product for any slug in development
        if (isDev) {
            return ;
        }
        return undefined;
    },

    async getCategories() {
        // TODO: Replace with actual API call
        return [];
    },

    async getCategoryBySlug(slug: string) {
        // TODO: Replace with actual API call
        return null;
    },

    async getCart() {
        // TODO: Replace with actual API call
        return undefined;
    },

    async addToCart(productId: string, quantity: number) {
        // TODO: Replace with actual API call
        throw new Error('Not implemented');
    },

    async updateCartItem(itemId: string, quantity: number) {
        // TODO: Replace with actual API call
        throw new Error('Not implemented');
    },

    async removeFromCart(itemId: string) {
        // TODO: Replace with actual API call
        throw new Error('Not implemented');
    },

    async createOrder(items, customerInfo) {
        // TODO: Replace with actual API call
        throw new Error('Not implemented');
    },

    async getOrder(id: string, email: string) {
        // TODO: Replace with actual API call
        return undefined;
    },

    async login(email: string, password: string) {
        // TODO: Replace with actual API call
        throw new Error('Not implemented');
    },

    async logout() {
        // TODO: Replace with actual API call
    },

    async register(email: string, password: string, data) {
        // TODO: Replace with actual API call
        throw new Error('Not implemented');
    },

    async getCurrentUser() {
        // TODO: Replace with actual API call
        return undefined;
    },

    async updateUser(userData) {
        // TODO: Replace with actual API call
        throw new Error('Not implemented');
    },

    async forgotPassword(email: string) {
        // TODO: Replace with actual API call
    },

    async resetPassword(token: string, newPassword: string) {
        // TODO: Replace with actual API call
    }
});

export async function initializeApiForRequest(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || undefined;
    
    return {
        token,
        isAuthenticated: Boolean(token),
        api: createApiClient(token)
    };
}

export async function getUserFromSession(request: Request): Promise<User | null> {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || undefined;
    
    if (!token) {
        return null;
    }

    const api = createApiClient(token);
    const user = await api.getCurrentUser();
    return user || null;
}