// Product types
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    slug: string;
}

export interface ProductVariant {
    id: string;
    title: string;
    price: number;
    stock: number;
    options: Record<string, string>;
}

export interface ProductOption {
    name: string;
    values: string[];
}

export interface Category {
    id: string;
    slug: string;
    name: string;
    description?: string;
    image?: string;
}

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
}

export interface Cart {
    id: string;
    items: CartItem[];
    subtotal: number;
    total: number;
    tax: number;
}

// Order types
export interface OrderItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
}

export interface CustomerInfo {
    email: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface Order {
    id: string;
    items: OrderItem[];
    customer: CustomerInfo;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    subtotal: number;
    total: number;
    createdAt: string;
}

export interface Address {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// API Client interface
export interface ApiClient {
    // Products
    getProducts(options: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{ items: Product[]; total: number }>;
    
    getProductBySlug(slug: string): Promise<Product | undefined>;
    
    // Categories
    getCategories(): Promise<Category[]>;
    getCategoryBySlug(slug: string): Promise<Category | null>;
    
    // Cart
    getCart(): Promise<Cart | undefined>;
    addToCart(productId: string, quantity: number): Promise<Cart>;
    updateCartItem(itemId: string, quantity: number): Promise<Cart>;
    removeFromCart(itemId: string): Promise<Cart>;
    
    // Orders
    createOrder(items: OrderItem[], customerInfo: CustomerInfo): Promise<Order>;
    getOrder(id: string, email: string): Promise<Order | undefined>;
    
    // Auth
    login(email: string, password: string): Promise<AuthResponse>;
    logout(): Promise<void>;
    register(email: string, password: string, data?: Partial<User>): Promise<AuthResponse>;
    getCurrentUser(): Promise<User | undefined>;
    updateUser(userData: Partial<User>): Promise<User>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
} 