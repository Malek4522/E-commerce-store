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
    type?: string;
}

// Order types
export interface Order {
    id: string;
    createdAt: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    priceSummary: {
        subtotal: { amount: number; formattedAmount: string };
        shipping: { amount: number; formattedAmount: string };
        tax: { amount: number; formattedAmount: string };
        total: { amount: number; formattedAmount: string };
    };
    shippingInfo: {
        contact: ContactDetails;
        address: Address;
        deliveryTime?: string;
    };
    billingInfo: {
        contact: ContactDetails;
        address: Address;
    };
    buyerNote?: string;
}

export interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
    price: {
        amount: number;
        formattedAmount: string;
    };
    image?: {
        url: string;
        altText?: string;
    };
    options?: {
        name: string;
        value: string;
    }[];
}

export interface CustomerInfo {
    shippingInfo: {
        contact: ContactDetails;
        address: Address;
        deliveryTime?: string;
    };
    billingInfo: {
        contact: ContactDetails;
        address: Address;
    };
    buyerNote?: string;
}

export interface ContactDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
}

// API Client interface
export interface ApiClient {
    // Products
    getProducts(options?: {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
    }): Promise<{ items: Product[]; total: number }>;
    
    getProductBySlug(slug: string): Promise<Product | undefined>;
    
    // Categories
    getCategories(): Promise<Category[]>;
    getCategoryBySlug(slug: string): Promise<Category | null>;

    // Orders
    getOrders(): Promise<{ items: Order[]; total: number }>;
    getOrder(id: string, email: string): Promise<Order | undefined>;
    createOrder(items: OrderItem[], customerInfo: CustomerInfo): Promise<Order>;
} 