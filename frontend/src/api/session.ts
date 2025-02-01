import { ApiClient, User, Product } from './types';

const isDev = import.meta.env.DEV;

// Mock data
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

// Mock API client implementation
const createApiClient = (token?: string): ApiClient => ({
    async getProducts({ page = 1, limit = 12, search }) {
        // TODO: Replace with actual API call
        return {
            items: [mockProduct],
            total: 1
        };
    },

    async getProductBySlug(slug: string) {
        // Return mock product for any slug in development
        if (isDev) {
            return mockProduct;
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