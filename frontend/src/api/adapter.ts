import { ApiClient, Product, Order, OrderItem, CustomerInfo } from './types';
import { CustomApiClient } from './client';

export interface CustomApi {
    // Product methods
    getProducts(options?: { 
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{ items: Product[]; total: number }>;
    
    getProductBySlug(slug: string): Promise<Product | undefined>;

    // Order methods
    createOrder(items: OrderItem[], customerInfo: CustomerInfo): Promise<Order>;
    getOrder(id: string, email: string): Promise<Order | undefined>;
}

export function createCustomApi(baseUrl?: string): CustomApi {
    const client = new CustomApiClient(baseUrl);

    return {
        async getProducts({ page = 1, limit = 100, search } = {}) {
            return client.getProducts({
                page,
                limit,
                search,
            });
        },

        async getProductBySlug(slug) {
            return client.getProductBySlug(slug);
        },

        async createOrder(items, customerInfo) {
            return client.createOrder(items, customerInfo);
        },

        async getOrder(id, email) {
            return client.getOrder(id, email);
        }
    };
} 