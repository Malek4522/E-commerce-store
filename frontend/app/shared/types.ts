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
    salePrice?: number;
    variants: ProductVariant[];
    soldPercentage: number;
    isNew: boolean;
    links: ProductLink[];
    colors: string[];
    sizes: string[];
    createdAt: string;
    updatedAt: string;
} 