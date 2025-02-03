export interface ProductVariant {
    size: string;
    color: string;
    quantity: number;
}

export interface ProductLink {
    url: string;
    type: 'image' | 'video';
}

export interface Product {
    _id: string;
    name: string;
    description?: string;
    type: 'Jumpsuit' | 'Robe' | 'Jupe';
    price: number;
    soldPrice: number;
    variants: ProductVariant[];
    isNew: boolean;
    links: ProductLink[];
    colors: string[];
    sizes: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        links: ProductLink[];
        slug: string;
        variants: ProductVariant[];
        colors: string[];
        sizes: string[];
    };
    color: string;
    size: string;
    fullName: string;
    phoneNumber: string;
    address?: string;
    state: string;
    region: string;
    delivery: 'home' | 'center';
    status: 'waiting' | 'delivering' | 'delivered' | 'canceled';
    createdAt: string;
    updatedAt: string;
} 