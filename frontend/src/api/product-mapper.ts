import type { Product as BackendProduct } from '../../app/api/admin/types';
import type { Product as FrontendProduct } from './types';

function formatPrice(price: number): string {
    const [whole, decimal] = price.toFixed(2).split('.');
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedWhole},${decimal} DA`;
}

export function mapBackendProductToFrontend(product: BackendProduct): FrontendProduct {
    return {
        id: product._id,
        name: product.name,
        slug: product.name.toLowerCase().replace(/ /g, '-'),
        description: product.description || '',
        price: {
            amount: product.price,
            formatted: formatPrice(product.price),
            soldPrice: product.soldPrice || undefined,
            soldPriceFormatted: product.soldPrice ? formatPrice(product.soldPrice) : undefined
        },
        images: product.links
            .filter(link => link.type === 'image')
            .map(link => ({
                id: link.url,
                url: link.url,
                altText: product.name
            })),
        links: product.links.map(link => ({
            url: link.url,
            type: link.type,
            id: link._id
        })),
        categoryId: product.type.toLowerCase(),
        ribbon: product.isNew ? 'New' : (product.soldPrice > 0 ? 'Sale' : undefined),
        stock: product.variants.reduce((total, variant) => total + variant.quantity, 0),
        inventoryStatus: product.variants.some(variant => variant.quantity > 0) ? 'IN_STOCK' : 'OUT_OF_STOCK',
        variants: product.variants,
        colors: product.colors,
        sizes: product.sizes
    };
} 