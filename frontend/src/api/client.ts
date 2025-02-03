import { ApiClient, AuthResponse, Cart, Category, Order, Product, User, OrderItem, CustomerInfo } from './types';

export class CustomApiClient implements ApiClient {
    private baseUrl: string;
    private token: string | null;

    constructor(baseUrl: string = typeof window === 'undefined' ? 'http://localhost:5000/api' : '/api') {
        this.baseUrl = baseUrl;
        this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    }

    private async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
        const headers = new Headers({
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        });

        if (this.token) {
            headers.set('Authorization', `Bearer ${this.token}`);
        }

        try {
            const response = await fetch(`${this.baseUrl}${path}`, {
                ...options,
                headers,
            });

            if (response.status === 401) {
                this.token = null;
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                }
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }
        }
    }

    // Products
    async getProducts(options: {
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

    async getProductBySlug(slug: string): Promise<Product | undefined> {
        try {
            return await this.fetch(`/product/${slug}`);
        } catch (error) {
            if ((error as any).status === 404) return undefined;
            throw error;
        }
    }

    // Categories
    async getCategories(): Promise<Category[]> {
        return this.fetch('/categories');
    }

    async getCategoryBySlug(slug: string): Promise<Category | null> {
        return this.fetch(`/categories/${slug}`);
    }

    // Cart
    async getCart(): Promise<Cart | undefined> {
        try {
            return await this.fetch('/cart');
        } catch (error) {
            if ((error as any).status === 404) return undefined;
            throw error;
        }
    }

    async addToCart(productId: string, quantity: number): Promise<Cart> {
        return this.fetch('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity }),
        });
    }

    async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
        return this.fetch(`/cart/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    }

    async removeFromCart(itemId: string): Promise<Cart> {
        return this.fetch(`/cart/items/${itemId}`, {
            method: 'DELETE',
        });
    }

    // Orders
    async getOrders(): Promise<{ items: Order[]; total: number }> {
        return this.fetch('/orders');
    }

    async getOrder(id: string, email: string): Promise<Order | undefined> {
        try {
            return await this.fetch(`/orders/${id}?email=${encodeURIComponent(email)}`);
        } catch (error) {
            if ((error as any).status === 404) return undefined;
            throw error;
        }
    }

    async createOrder(items: OrderItem[], customerInfo: CustomerInfo): Promise<Order> {
        return this.fetch('/orders/', {
            method: 'POST',
            body: JSON.stringify({ items, customerInfo }),
        });
    }

    // Auth
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await this.fetch<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(response.token);
        return response;
    }

    async logout(): Promise<void> {
        await this.fetch('/auth/logout', { method: 'POST' });
        this.setToken(null);
    }

    async register(email: string, password: string, data?: Partial<User>): Promise<AuthResponse> {
        const response = await this.fetch<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, ...data }),
        });
        this.setToken(response.token);
        return response;
    }

    async getCurrentUser(): Promise<User | undefined> {
        try {
            return await this.fetch('/user');
        } catch (error) {
            if ((error as any).status === 401) return undefined;
            throw error;
        }
    }

    async updateUser(userData: Partial<User>): Promise<User> {
        return this.fetch('/user', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async forgotPassword(email: string): Promise<void> {
        await this.fetch('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        await this.fetch('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        });
    }
} 