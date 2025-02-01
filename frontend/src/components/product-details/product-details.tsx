import { useState } from 'react';
import classNames from 'classnames';
import { Accordion } from '../accordion/accordion';
import { BreadcrumbData, Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { MinusIcon, PlusIcon } from '../icons';
import { ProductImages } from '../product-images/product-images';
import { ProductOption } from '../product-option/product-option';
import { ProductPrice } from '../product-price/product-price';
import { QuantityInput } from '../quantity-input/quantity-input';
import { ShareProductLinks } from '../share-product-links/share-product-links';
import { toast } from '../toast/toast';
import { initializeApiForRequest } from '~/src/api/session';
import { Product } from '~/src/api/types';
import { getErrorMessage } from '~/src/utils';

import styles from './product-details.module.scss';

export interface ProductDetailsProps {
    product: Product;
    canonicalUrl: string;
    breadcrumbs: BreadcrumbData[];
}

export function ProductDetails({ product, canonicalUrl, breadcrumbs }: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [addToCartAttempted, setAddToCartAttempted] = useState(false);

    const handleOptionChange = (name: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [name]: value }));
    };

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);
    };

    const handleAddToCart = async () => {
        try {
            setAddToCartAttempted(true);

            // Check if all required options are selected
            const missingOptions = product.options?.some(
                option => !selectedOptions[option.name]
            );

            if (missingOptions) {
                toast.error('Please select all required options');
                return;
            }

            setIsAddingToCart(true);
            const { api } = await initializeApiForRequest(new Request(window.location.href));
            await api.addToCart(product.id, quantity);
            toast.success('Added to cart');
            setAddToCartAttempted(false);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsAddingToCart(false);
        }
    };

    const isOutOfStock = product.inventoryStatus === 'OUT_OF_STOCK';

    return (
        <div className={styles.page}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className={styles.content}>
                <ProductImages images={product.images} />

                <div>
                    <h1 className={styles.productName}>{product.name}</h1>

                    <ProductPrice
                        className={styles.price}
                        price={product.price.formatted}
                        discountedPrice={product.price.discountedFormatted}
                    />

                    {product.description && (
                        <div
                            className={styles.description}
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    )}

                    {product.options && product.options.length > 0 && (
                        <div className={styles.productOptions}>
                            {product.options.map((option) => (
                                <ProductOption
                                    key={option.name}
                                    name={option.name}
                                    optionType={option.optionType}
                                    choices={option.choices}
                                    selectedValue={selectedOptions[option.name]}
                                    error={
                                        addToCartAttempted && !selectedOptions[option.name]
                                            ? `Select ${option.name}`
                                            : undefined
                                    }
                                    onChange={(value) => handleOptionChange(option.name, value)}
                                />
                            ))}
                        </div>
                    )}

                    <div className={styles.quantity}>
                        <label htmlFor="quantity" className={styles.quantityLabel}>
                            Quantity
                        </label>
                        <QuantityInput
                            id="quantity"
                            value={quantity}
                            onChange={handleQuantityChange}
                            disabled={isOutOfStock}
                        />
                    </div>

                    <button
                        className={classNames('button', 'primaryButton', styles.addToCartButton)}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isAddingToCart}
                    >
                        {isOutOfStock ? 'Out of stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>

                    {product.additionalInfo && product.additionalInfo.length > 0 && (
                        <Accordion
                            className={styles.additionalInfoSections}
                            expandIcon={<PlusIcon width={22} />}
                            collapseIcon={<MinusIcon width={22} />}
                            items={product.additionalInfo.map((section) => ({
                                header: (
                                    <div className={styles.additionalInfoSectionTitle}>
                                        {section.title}
                                    </div>
                                ),
                                content: section.content ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: section.content,
                                        }}
                                    />
                                ) : null,
                            }))}
                            initialOpenItemIndex={0}
                        />
                    )}

                    <ShareProductLinks
                        className={styles.socialLinks}
                        productCanonicalUrl={canonicalUrl}
                    />
                </div>
            </div>
        </div>
    );
} 