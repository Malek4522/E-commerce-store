import { ApiClient, Category, Order, Product, OrderItem, CustomerInfo } from './types';

export class CustomApiClient implements ApiClient {
    private baseUrl: string;

    public constructor(baseUrl: string = typeof window === 'undefined' ? import.meta.env.VITE_API_URL : '/api') {
        this.baseUrl = baseUrl;
    }

    private async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
        const headers = new Headers({
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        });

        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    // Products
    public async getProducts(options: {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
    } = {}): Promise<{ items: Product[]; total: number }> {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.search) params.append('search', options.search);
        if (options.type) params.append('type', options.type);

        const queryString = params.toString();
        return this.fetch(`/product${queryString ? `?${queryString}` : ''}`);
    }

    public async getProductBySlug(slug: string): Promise<Product | undefined> {
        try {
            return await this.fetch(`/product/${slug}`);
        } catch (error) {
            if ((error as any).status === 404) return undefined;
            throw error;
        }
    }

    // Categories
    public async getCategories(): Promise<Category[]> {
        return this.fetch('/categories');
    }

    public async getCategoryBySlug(slug: string): Promise<Category | null> {
        return this.fetch(`/categories/${slug}`);
    }

    // Orders
    public async getOrders(): Promise<{ items: Order[]; total: number }> {
        return this.fetch('/orders');
    }

    public async getOrder(id: string, email: string): Promise<Order | undefined> {
        try {
            return await this.fetch(`/orders/${id}?email=${encodeURIComponent(email)}`);
        } catch (error) {
            if ((error as any).status === 404) return undefined;
            throw error;
        }
    }

    public async createOrder(items: OrderItem[], customerInfo: CustomerInfo): Promise<Order> {
        return this.fetch('/orders/', {
            method: 'POST',
            body: JSON.stringify({ items, customerInfo }),
        });
    }
} 