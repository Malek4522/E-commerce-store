// Product types
export type InventoryStatus = 'IN_STOCK' | 'OUT_OF_STOCK';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: {
        amount: number;
        formatted: string;
        soldPrice?: number;
        soldPriceFormatted?: string;
    };
    images: ProductImage[];
    links?: ProductLink[];
    categoryId: string;
    ribbon?: string;
    stock: number;
    isNew: boolean;
    inventoryStatus?: InventoryStatus;
    options?: ProductOption[];
    additionalInfo?: {
        title: string;
        content: string;
    }[];
    variants: ProductVariant[];
    colors: string[];
    sizes: string[];
}

export interface ProductImage {
    id: string;
    url: string;
    altText?: string;
}

export interface ProductLink {
    url: string;
    type: 'video' | 'image';
    id?: string;
}

export interface ProductVariant {
    size: string;
    color: string;
    quantity: number;
}

export enum OptionType {
    color = 'color',
    size = 'size',
    style = 'style'
}

export interface Choice {
    value: string;
    description: string;
    inStock: boolean;
    visible: boolean;
}

export interface ProductOption {
    name: string;
    optionType: OptionType;
    choices: Choice[];
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

export interface Image {
    url: string;
    altText?: string;
}

export interface Price {
    amount: number;
    formattedAmount: string;
}

export interface CartItemOption {
    name: string;
    value: string;
}

export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    image?: Image;
    price: Price;
    fullPrice?: Price;
    options?: CartItemOption[];
    isAvailable: boolean;
}

export interface Cart {
    id: string;
    items: CartItem[];
    subtotal: number;
    total: number;
    tax: number;
}

// Order types
export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
}

export interface ContactDetails {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    image?: Image;
    price: Price;
    options?: CartItemOption[];
}

export interface PriceSummary {
    subtotal: Price;
    shipping: Price;
    tax: Price;
    total: Price;
}

export interface ShippingInfo {
    address: Address;
    contact: ContactDetails;
    deliveryTime?: string;
}

export interface BillingInfo {
    address: Address;
    contact: ContactDetails;
}

export interface Order {
    id: string;
    items: OrderItem[];
    priceSummary: PriceSummary;
    shippingInfo: ShippingInfo;
    billingInfo: BillingInfo;
    buyerNote?: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: string;
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

// Product sorting and filtering
export enum ProductSortBy {
    NAME_ASC = 'name_asc',
    NAME_DESC = 'name_desc',
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
}

export enum ProductFilter {
    minPrice = 'minPrice',
    maxPrice = 'maxPrice',
    search = 'search',
}

export interface ProductFilters {
    price?: { min: number; max: number };
    categories?: string[];
    search?: string;
}

// API Client interface
export interface ApiClient {
    // Products
    getProducts(options: {
        page?: number;
        limit?: number;
        search?: string;
        categories?: string[];
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