import { useState } from 'react';
import classNames from 'classnames';
import { Accordion } from '../accordion/accordion';
import { BreadcrumbData, Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { MinusIcon, PlusIcon } from '../icons';
import { ProductImages } from '../product-images/product-images';
import { ProductOption } from '../product-option/product-option';
import { ProductPrice } from '../product-price/product-price';
import { toast } from '../toast/toast';
import { initializeApiForRequest } from '~/src/api/session';
import { Product } from '~/src/api/types';
import { getErrorMessage } from '~/src/utils';
import { calculateDeliveryPrice, calculateTotalPrice } from '~/app/utils/delivery-prices';

import styles from './product-details.module.scss';

// Add ProductVariant type
interface ProductVariant {
    size: string;
    color: string;
    quantity: number;
}

export interface ProductDetailsProps {
    product: Product;
    canonicalUrl: string;
    breadcrumbs: BreadcrumbData[];
}

// Get wilayas from a constant since we can't import from delivery-prices
const WILAYAS = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
    'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
    'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
    'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
    'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj',
    'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
    'Souk Ahras', 'Tipaza', 'Mila', 'Ain Defla', 'Naâma', 'Ain Témouchent',
    'Ghardaïa', 'Relizane', 'Timmimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal',
    'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'M\'Ghair',
    'El Menia'
];

function formatPrice(price: number | undefined | null): string {
    if (price === undefined || price === null || isNaN(price)) return '0,00 DA';
    const [whole, decimal] = price.toFixed(2).split('.');
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedWhole},${decimal} DA`;
}

export function ProductDetails({ product, canonicalUrl, breadcrumbs }: ProductDetailsProps) {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [addToCartAttempted, setAddToCartAttempted] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderForm, setOrderForm] = useState({
        fullName: '',
        phoneNumber: '',
        state: 'Alger',
        region: '',
        delivery: 'home' as 'home' | 'center',
        color: '',
        size: ''
    });

    // Transform product links into the format expected by ProductImages
    const mediaItems = [
        // Add regular images first
        ...(product.images || []).map(image => ({
            url: image.url,
            type: 'image' as const,
            altText: image.altText || product.name
        })),
        // Add video links
        ...((product.links || [])
            .filter(link => link.type === 'video')
            .map(link => ({
                url: link.url,
                type: link.type,
                altText: product.name
            })))
    ];

    const handleOptionChange = (name: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [name]: value }));
    };

    // Get available variants
    const getAvailableColors = (selectedSize: string = '') => {
        if (!product.variants) return [];
        return [...new Set(
            product.variants
                .filter(v => v.quantity > 0) // Only variants with stock
                .filter(v => !selectedSize || v.size === selectedSize)
                .map(v => v.color)
        )];
    };

    const getAvailableSizes = (selectedColor: string = '') => {
        if (!product.variants) return [];
        return [...new Set(
            product.variants
                .filter(v => v.quantity > 0) // Only variants with stock
                .filter(v => !selectedColor || v.color === selectedColor)
                .map(v => v.size)
        )];
    };

    // Check if a specific variant is available
    const isVariantAvailable = (color: string, size: string) => {
        if (!product.variants) return false;
        return product.variants.some(v => 
            v.color === color && 
            v.size === size && 
            v.quantity > 0
        );
    };

    const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrderForm(prev => {
            const updates: Partial<typeof prev> = { [name]: value };
            
            // Handle variant selection logic
            if (name === 'size') {
                // Find available colors for this size
                const availableColors = product.variants
                    .filter(v => v.size === value && v.quantity > 0)
                    .map(v => v.color);
                
                // Keep current color if available, otherwise use first available color
                updates.color = availableColors.includes(prev.color) ? 
                    prev.color : availableColors[0];
            } else if (name === 'color') {
                // Find available sizes for this color
                const availableSizes = product.variants
                    .filter(v => v.color === value && v.quantity > 0)
                    .map(v => v.size);
                
                // Keep current size if available, otherwise use first available size
                updates.size = availableSizes.includes(prev.size) ? 
                    prev.size : availableSizes[0];
            }
            
            return { ...prev, ...updates };
        });
    };

    // Calculate prices based on current form values
    const basePrice = product.price.soldPrice && product.price.soldPrice > 0 
        ? Number(product.price.soldPrice) 
        : Number(product.price.amount);
    const deliveryPrice = calculateDeliveryPrice(orderForm.state, orderForm.delivery);
    const totalPrice = calculateTotalPrice(basePrice, orderForm.state, orderForm.delivery);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!orderForm.color || !orderForm.size) {
            toast.error('Please select a size and color');
            return;
        }

        try {
            setIsAddingToCart(true);
            const { api } = await initializeApiForRequest(new Request(window.location.href));
            
            // Create the order
            const response = await fetch(`${import.meta.env.VITE_API_URL}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    color: orderForm.color,
                    size: orderForm.size,
                    fullName: orderForm.fullName,
                    phoneNumber: orderForm.phoneNumber,
                    state: orderForm.state,
                    region: orderForm.region,
                    delivery: orderForm.delivery
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to place order');
            }

            toast.success('Order placed successfully!');
            setShowOrderForm(false);
            setOrderForm({
                fullName: '',
                phoneNumber: '',
                state: 'Alger',
                region: '',
                delivery: 'home',
                color: '',
                size: ''
            });
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (isOutOfStock) {
            toast.error('Product is out of stock');
            return;
        }

        // Get all available sizes first (those with quantity > 0)
        const availableSizes = [...new Set(
            product.variants
                .filter(v => v.quantity > 0)
                .map(v => v.size)
        )];

        if (availableSizes.length > 0) {
            const firstSize = availableSizes[0];
            // Get available colors for this size
            const availableColors = product.variants
                .filter(v => v.size === firstSize && v.quantity > 0)
                .map(v => v.color);

            setOrderForm(prev => ({
                ...prev,
                size: firstSize,
                color: availableColors[0] || ''
            }));
        }

        setShowOrderForm(true);
    };

    const isOutOfStock = !product.variants?.some(v => v.quantity > 0);

    return (
        <div className={styles.page}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className={styles.content}>
                <div className={styles.mediaSection}>
                    <ProductImages images={mediaItems} />
                </div>

                <div className={styles.detailsSection}>
                    <h1 className={styles.productName}>{product.name}</h1>
                    <div className={styles.sku}>SKU: {product.id}</div>
                    <div className={styles.sku}>Colors: {[...new Set(product.variants.map(v => v.color))].join(' • ')}</div>
                    <div className={styles.sku}>Sizes: {[...new Set(product.variants.map(v => v.size))].join(' • ')}</div>

                    <div className={styles.price}>
                        {product.price.soldPriceFormatted ? (
                            <div className={styles.priceWrapper}>
                                <span className={styles.original}>{product.price.formatted}</span>
                                <span className={styles.discounted}>{product.price.soldPriceFormatted}</span>
                            </div>
                        ) : (
                            <span className={styles.regularPrice}>{product.price.formatted}</span>
                        )}
                    </div>

                    <button
                        className={classNames(styles.addToCartButton, {
                            [styles.outOfStock]: isOutOfStock
                        })}
                        onClick={handleBuyNow}
                        disabled={isOutOfStock || isAddingToCart}
                    >
                        {isOutOfStock ? 'Out of stock' : isAddingToCart ? 'Processing...' : 'Buy Now'}
                    </button>

                    {showOrderForm && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modal}>
                                <h2>Complete Your Order</h2>
                                <form onSubmit={handleSubmitOrder}>
                                    <div className={styles.formGroup}>
                                        <label>Select Variant</label>
                                        <div className={styles.variantMatrix}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        {[...new Set(product.variants.map(v => v.color))].map(color => (
                                                            <th key={color}>{color}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[...new Set(product.variants.map(v => v.size))].map(size => (
                                                        <tr key={size}>
                                                            <th>{size}</th>
                                                            {[...new Set(product.variants.map(v => v.color))].map(color => {
                                                                const variant = product.variants.find(
                                                                    v => v.size === size && v.color === color
                                                                );
                                                                const isAvailable = variant && variant.quantity > 0;
                                                                const isSelected = orderForm.size === size && orderForm.color === color;

                                                                return (
                                                                    <td key={`${size}-${color}`}>
                                                                        <button
                                                                            type="button"
                                                                            className={classNames(styles.variantCell, {
                                                                                [styles.available]: isAvailable,
                                                                                [styles.selected]: isSelected,
                                                                                [styles.unavailable]: !isAvailable
                                                                            })}
                                                                            onClick={() => {
                                                                                if (isAvailable) {
                                                                                    setOrderForm(prev => ({
                                                                                        ...prev,
                                                                                        size,
                                                                                        color
                                                                                    }));
                                                                                }
                                                                            }}
                                                                            disabled={!isAvailable}
                                                                        >
                                                                            {isAvailable ? (
                                                                                isSelected ? '✓' : ''
                                                                            ) : (
                                                                                '×'
                                                                            )}
                                                                        </button>
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="fullName">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={orderForm.fullName}
                                            onChange={handleOrderFormChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={orderForm.phoneNumber}
                                            onChange={handleOrderFormChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="state">State</label>
                                        <select
                                            id="state"
                                            name="state"
                                            value={orderForm.state}
                                            onChange={handleOrderFormChange}
                                            required
                                        >
                                            {WILAYAS.map((wilaya: string) => (
                                                <option key={wilaya} value={wilaya}>
                                                    {wilaya}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="region">Region</label>
                                        <input
                                            type="text"
                                            id="region"
                                            name="region"
                                            value={orderForm.region}
                                            onChange={handleOrderFormChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="delivery">Delivery Type</label>
                                        <div className={styles.deliveryOptions}>
                                            <button
                                                type="button"
                                                className={classNames({
                                                    [styles.selected]: orderForm.delivery === 'home',
                                                    [styles.home]: true
                                                })}
                                                onClick={() => handleOrderFormChange({
                                                    target: { name: 'delivery', value: 'home' }
                                                } as any)}
                                            >
                                                Home Delivery
                                            </button>
                                            <button
                                                type="button"
                                                className={classNames({
                                                    [styles.selected]: orderForm.delivery === 'center',
                                                    [styles.center]: true
                                                })}
                                                onClick={() => handleOrderFormChange({
                                                    target: { name: 'delivery', value: 'center' }
                                                } as any)}
                                            >
                                                Center Pickup
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add Price Summary */}
                                    <div className={styles.priceSummary}>
                                        <div className={styles.priceRow}>
                                            <span>Product Price:</span>
                                            <span>{formatPrice(basePrice)}</span>
                                        </div>
                                        {deliveryPrice !== null && (
                                            <div className={styles.priceRow}>
                                                <span>Delivery Price:</span>
                                                <span>{formatPrice(deliveryPrice)}</span>
                                            </div>
                                        )}
                                        {totalPrice !== null && (
                                            <div className={`${styles.priceRow} ${styles.total}`}>
                                                <span>Total Price:</span>
                                                <span>{formatPrice(totalPrice)}</span>
                                            </div>
                                        )}
                                        {deliveryPrice === null && (
                                            <div className={styles.warning}>
                                                Delivery not available in this state
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.modalActions}>
                                        <button
                                            type="button"
                                            onClick={() => setShowOrderForm(false)}
                                            className={styles.cancelButton}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isAddingToCart}
                                            className={styles.submitButton}
                                        >
                                            {isAddingToCart ? 'Processing...' : 'Place Order'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className={styles.accordionSection}>
                        <Accordion
                            items={[
                                ...(product.description ? [{
                                    header: 'Product Info',
                                    content: <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                }] : []),
                                {
                                    header: 'Shipping Info',
                                    content: 'Le transport est assuré par ZR EXPRESS avec une durée de livraison de 2 jours en moyenne, 3 jours maximum.'
                                },
                                {
                                    header: 'Return & Refund Policy',
                                    content: 'Après avoir sélectionné le produit et effectué une demande de livraison, nous vous appellerons au numéro que vous avez fourni pour confirmer la commande. Vous pouvez annuler la commande à tout moment en nous appelant. Lors de la livraison, vous pouvez vérifier si le produit correspond aux photos et s\'il n\'est pas endommagé. Si vous l\'acceptez, vous payez le livreur et la transaction est terminée. Sinon, vous pouvez simplement refuser la commande. Les commandes achetées ne peuvent pas être retournées ou échangées, sauf si nous livrons des tailles ou des couleurs incorrectes. Dans ce cas, nous les remplaçons avec livraison gratuite. Sinon, vous devrez payer à nouveau les frais de livraison.'
                                }
                            ]}
                            expandIcon={<MinusIcon className={styles.accordionIcon} />}
                            collapseIcon={<PlusIcon className={styles.accordionIcon} />}
                        />
                    </div>

                    <div className={styles.socialLinks}>
                        <a 
                            href={import.meta.env.VITE_FACEBOOK_URL}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.socialLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a 
                            href={import.meta.env.VITE_INSTAGRAM_URL}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.socialLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a 
                            href={import.meta.env.VITE_TIKTOK_URL}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.socialLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                        </a>
                        <a 
                            href={`https://api.whatsapp.com/send?phone=${import.meta.env.VITE_WHATSAPP_NUMBER}&text=${encodeURIComponent(`Check out this product: ${import.meta.env.VITE_PUBLIC_URL}/product-details/${product.id}`)}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.socialLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
} 