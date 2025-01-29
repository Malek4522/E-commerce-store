export type ProductVariant = {
    size: string;
    color: string;
    quantity: number;
};

export type ProductLink = {
    url: string;
    type: 'video' | 'image';
};

export type Product = {
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
    colors: string[]; // Virtual property
    sizes: string[]; // Virtual property
    createdAt: string;
    updatedAt: string;
}; 