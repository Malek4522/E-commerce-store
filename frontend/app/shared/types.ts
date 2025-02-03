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
    variants: ProductVariant[];
    soldPrice?: number;
    isNew: boolean;
    links: ProductLink[];
    colors: string[];
    sizes: string[];
    createdAt: string;
    updatedAt: string;
} 