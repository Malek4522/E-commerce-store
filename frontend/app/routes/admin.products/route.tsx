import type { MetaFunction } from '@remix-run/react';
import { useState, useCallback } from 'react';
import type { Product, ProductVariant, ProductLink } from '../../types/product';
import styles from './route.module.scss';

// Media Preview Modal Component
function MediaPreviewModal({ 
    media, 
    onClose,
    allMedia = false,
    mediaItems = []
}: { 
    media: ProductLink | null;
    onClose: () => void;
    allMedia?: boolean;
    mediaItems?: ProductLink[];
}) {
    if (!media && !allMedia) return null;

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.match(/[?&]v=([^&]+)/);
        return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : '';
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                {allMedia ? (
                    <div className={styles.allMediaGrid}>
                        {mediaItems.map((item, index) => (
                            <div key={index} className={styles.mediaItem}>
                                {item.type === 'image' ? (
                                    <img 
                                        src={item.url} 
                                        alt={`Media ${index + 1}`}
                                        className={styles.gridImage}
                                    />
                                ) : (
                                    <div className={styles.gridVideo}>
                                        <iframe
                                            src={getYouTubeEmbedUrl(item.url)}
                                            title={`Video ${index + 1}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    media && (
                        media.type === 'image' ? (
                            <img 
                                src={media.url} 
                                alt="Product preview" 
                                className={styles.previewImage}
                            />
                        ) : (
                            <div className={styles.videoWrapper}>
                                <iframe
                                    src={getYouTubeEmbedUrl(media.url)}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    );
}

// Delete Confirmation Modal
function DeleteConfirmModal({ 
    product,
    onClose,
    onConfirm
}: { 
    product: Product | null;
    onClose: () => void;
    onConfirm: () => void;
}) {
    if (!product) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h3 className={styles.modalTitle}>Delete Product</h3>
                <p className={styles.modalText}>
                    Are you sure you want to delete "{product.name}"? This action cannot be undone.
                </p>
                <div className={styles.modalActions}>
                    <button 
                        className={`${styles.modalButton} ${styles.cancelButton}`}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className={`${styles.modalButton} ${styles.deleteButton}`}
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// Edit Product Modal
function EditProductModal({ 
    product,
    onClose,
    onSave
}: { 
    product: Product | null;
    onClose: () => void;
    onSave: (updatedProduct: Product) => void;
}) {
    if (!product) return null;

    const [editedProduct, setEditedProduct] = useState<Product>(product);
    const [newColor, setNewColor] = useState('');
    const [newSize, setNewSize] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedProduct);
    };

    const handleQuantityChange = (color: string, size: string, quantity: number) => {
        setEditedProduct(prev => ({
            ...prev,
            variants: prev.variants.map(variant => 
                variant.color === color && variant.size === size
                    ? { ...variant, quantity }
                    : variant
            )
        }));
    };

    const getQuantity = (color: string, size: string) => {
        const variant = editedProduct.variants.find(
            v => v.color === color && v.size === size
        );
        return variant ? variant.quantity : 0;
    };

    const addColor = () => {
        if (!newColor.trim()) return;
        
        const colors = Array.from(new Set(editedProduct.variants.map(v => v.color)));
        const sizes = Array.from(new Set(editedProduct.variants.map(v => v.size)));
        
        if (colors.includes(newColor)) return;

        const newVariants = [...editedProduct.variants];
        sizes.forEach(size => {
            newVariants.push({ color: newColor, size, quantity: 0 });
        });

        setEditedProduct(prev => ({
            ...prev,
            variants: newVariants,
            colors: [...prev.colors, newColor]
        }));
        setNewColor('');
    };

    const addSize = () => {
        if (!newSize.trim()) return;
        
        const colors = Array.from(new Set(editedProduct.variants.map(v => v.color)));
        const sizes = Array.from(new Set(editedProduct.variants.map(v => v.size)));
        
        if (sizes.includes(newSize)) return;

        const newVariants = [...editedProduct.variants];
        colors.forEach(color => {
            newVariants.push({ color, size: newSize, quantity: 0 });
        });

        setEditedProduct(prev => ({
            ...prev,
            variants: newVariants,
            sizes: [...prev.sizes, newSize]
        }));
        setNewSize('');
    };

    const removeColor = (colorToRemove: string) => {
        setEditedProduct(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.color !== colorToRemove),
            colors: prev.colors.filter(c => c !== colorToRemove)
        }));
    };

    const removeSize = (sizeToRemove: string) => {
        setEditedProduct(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.size !== sizeToRemove),
            sizes: prev.sizes.filter(s => s !== sizeToRemove)
        }));
    };

    // Get unique colors and sizes
    const colors = Array.from(new Set(editedProduct.variants.map(v => v.color)));
    const sizes = Array.from(new Set(editedProduct.variants.map(v => v.size)));

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} ${styles.editModal}`} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h3 className={styles.modalTitle}>Edit Product</h3>
                <form onSubmit={handleSubmit} className={styles.editForm}>
                    <div className={styles.formGroup}>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={editedProduct.name}
                            onChange={e => setEditedProduct({...editedProduct, name: e.target.value})}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Type:</label>
                        <select
                            value={editedProduct.type}
                            onChange={e => setEditedProduct({...editedProduct, type: e.target.value as Product['type']})}
                            required
                        >
                            <option value="Robe">Robe</option>
                            <option value="Jumpsuit">Jumpsuit</option>
                            <option value="Jupe">Jupe</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Price (DA):</label>
                        <input
                            type="number"
                            value={editedProduct.price / 100}
                            onChange={e => setEditedProduct({...editedProduct, price: Math.round(parseFloat(e.target.value) * 100)})}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Sale Price (DA):</label>
                        <div className={styles.priceInputGroup}>
                            <input
                                type="number"
                                value={editedProduct.salePrice ? editedProduct.salePrice / 100 : ''}
                                onChange={e => {
                                    const value = e.target.value;
                                    setEditedProduct({
                                        ...editedProduct, 
                                        salePrice: value ? Math.round(parseFloat(value) * 100) : undefined
                                    });
                                }}
                                min="0"
                                step="0.01"
                                placeholder="Optional"
                            />
                            {editedProduct.salePrice && (
                                <div className={styles.discount}>
                                    {Math.round((1 - editedProduct.salePrice / editedProduct.price) * 100)}% OFF
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <div className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="isNew"
                                checked={editedProduct.isNew}
                                onChange={e => setEditedProduct({...editedProduct, isNew: e.target.checked})}
                            />
                            <label htmlFor="isNew">Set as New Product</label>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description:</label>
                        <textarea
                            value={editedProduct.description || ''}
                            onChange={e => setEditedProduct({...editedProduct, description: e.target.value})}
                            rows={3}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Variants:</label>
                        <table className={styles.variantTable}>
                            <thead>
                                <tr>
                                    <th>Color / Size</th>
                                    {sizes.map(size => (
                                        <th key={size}>
                                            {size}
                                            <button 
                                                type="button"
                                                className={styles.removeButton}
                                                onClick={() => removeSize(size)}
                                            >
                                                ×
                                            </button>
                                        </th>
                                    ))}
                                    <th className={styles.addCell}>
                                        <div className={styles.addSizeCell}>
                                            <input
                                                type="text"
                                                value={newSize}
                                                onChange={e => setNewSize(e.target.value)}
                                                placeholder="New size..."
                                            />
                                            <button type="button" onClick={addSize}>+</button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {colors.map(color => (
                                    <tr key={color}>
                                        <th>
                                            <div className={styles.colorCell}>
                                                <button 
                                                    type="button"
                                                    className={styles.removeButton}
                                                    onClick={() => removeColor(color)}
                                                >
                                                    ×
                                                </button>
                                                <span 
                                                    className={styles.colorDot} 
                                                    style={{ backgroundColor: color.toLowerCase() }}
                                                />
                                                {color}
                                            </div>
                                        </th>
                                        {sizes.map(size => (
                                            <td key={`${color}-${size}`}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={getQuantity(color, size)}
                                                    onChange={e => handleQuantityChange(
                                                        color,
                                                        size,
                                                        parseInt(e.target.value) || 0
                                                    )}
                                                />
                                            </td>
                                        ))}
                                        <td></td>
                                    </tr>
                                ))}
                                <tr className={styles.addRow}>
                                    <th>
                                        <div className={styles.addColorCell}>
                                            <input
                                                type="text"
                                                value={newColor}
                                                onChange={e => setNewColor(e.target.value)}
                                                placeholder="New color..."
                                            />
                                            <button type="button" onClick={addColor}>+</button>
                                        </div>
                                    </th>
                                    {sizes.map(size => (
                                        <td key={size}></td>
                                    ))}
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.formActions}>
                        <button 
                            type="button" 
                            className={`${styles.modalButton} ${styles.cancelButton}`}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={`${styles.modalButton} ${styles.saveButton}`}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Static example data
const EXAMPLE_PRODUCTS: Product[] = [
    {
        _id: '1',
        name: 'Elegant Summer Dress',
        description: 'Beautiful summer dress perfect for any occasion',
        type: 'Robe',
        price: 5999,
        variants: [
            { size: 'S', color: 'Blue', quantity: 5 },
            { size: 'M', color: 'Blue', quantity: 3 },
            { size: 'L', color: 'Blue', quantity: 2 },
            { size: 'M', color: 'Red', quantity: 4 },
        ],
        soldPercentage: 45,
        isNew: true,
        links: [
            { url: 'https://www.youtube.com/watch?v=-x2_0zs_Xic', type: 'video' },
            { url: 'https://www.youtube.com/watch?v=-x2_0zs_Xic', type: 'video' },
            { url: 'https://i.ibb.co/zTpHTZHp/image.jpg', type: 'image' },
            { url: 'https://i.ibb.co/zTpHTZHp/image.jpg', type: 'image' },
            { url: 'https://i.ibb.co/zTpHTZHp/image.jpg', type: 'image' }
        ],
        colors: ['Blue', 'Red'],
        sizes: ['S', 'M', 'L'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        _id: '2',
        name: 'Classic Jumpsuit',
        description: 'Comfortable and stylish jumpsuit',
        type: 'Jumpsuit',
        price: 7999,
        variants: [
            { size: 'S', color: 'Black', quantity: 8 },
            { size: 'M', color: 'Black', quantity: 6 },
            { size: 'L', color: 'Black', quantity: 4 },
            { size: 'XL', color: 'Black', quantity: 4 },
        ],
        soldPercentage: 30,
        isNew: false,
        links: [
            // H&M summer collection with 500K+ views
            { url: 'https://www.youtube.com/watch?v=-x2_0zs_Xic', type: 'video' },
            { url: 'https://i.ibb.co/zTpHTZHp/image.jpg', type: 'image' },
            { url: 'https://i.ibb.co/zTpHTZHp/image.jpg', type: 'image' }
        ],
        colors: ['Black'],
        sizes: ['S', 'M', 'L'],
        createdAt: '2024-01-10T15:30:00Z',
        updatedAt: '2024-01-10T15:30:00Z'
    }
];

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>(EXAMPLE_PRODUCTS);
    const [selectedMedia, setSelectedMedia] = useState<ProductLink | null>(null);
    const [viewingAllMedia, setViewingAllMedia] = useState(false);
    const [currentMediaItems, setCurrentMediaItems] = useState<ProductLink[]>([]);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const handleCloseModal = useCallback(() => {
        setSelectedMedia(null);
        setViewingAllMedia(false);
    }, []);

    const handleViewAllMedia = useCallback((links: ProductLink[]) => {
        setViewingAllMedia(true);
        setCurrentMediaItems(links);
    }, []);

    const handleDelete = useCallback((product: Product) => {
        setProductToDelete(product);
    }, []);

    const handleEdit = useCallback((product: Product) => {
        setProductToEdit(product);
    }, []);

    const confirmDelete = useCallback(() => {
        if (productToDelete) {
            setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
            setProductToDelete(null);
        }
    }, [productToDelete]);

    const handleSaveEdit = useCallback((updatedProduct: Product) => {
        setProducts(prev => prev.map(p => 
            p._id === updatedProduct._id ? updatedProduct : p
        ));
        setProductToEdit(null);
    }, []);

    const formatPrice = (price: number) => {
        return `${(price / 100).toFixed(2)} DA`;
    };

    const getTotalStock = (variants: ProductVariant[]) => {
        return variants.reduce((sum: number, variant: ProductVariant) => sum + variant.quantity, 0);
    };

    const getYouTubeVideoId = (url: string) => {
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    };

    const renderMediaLinks = (links: ProductLink[]) => {
        const previewItem = links[0]; // Show only first item in preview

        return (
            <div className={styles.mediaLinks}>
                <button 
                    className={styles.viewAllButton}
                    onClick={() => handleViewAllMedia(links)}
                >
                    <div className={styles.buttonPreview}>
                        {previewItem && (
                            previewItem.type === 'image' ? (
                                <img 
                                    src={previewItem.url} 
                                    alt="Preview"
                                    className={styles.previewThumbnail}
                                />
                            ) : (
                                <div className={styles.previewVideo}>
                                    <img 
                                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(previewItem.url)}/default.jpg`}
                                        alt="Video preview"
                                        className={styles.previewThumbnail}
                                    />
                                    <span className={styles.miniPlayIcon}>▶</span>
                                </div>
                            )
                        )}
                    </div>
                    <span className={styles.viewText}>View Media</span>
                </button>
            </div>
        );
    };

    return (
        <div className={styles.productsPage}>
            <header className={styles.header}>
                <h1>Products Management</h1>
                <button className={styles.addButton}>Add New Product</button>
            </header>
            <div className={styles.content}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Media</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Total Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td data-label="Media">{renderMediaLinks(product.links)}</td>
                                    <td data-label="Name">{product.name}</td>
                                    <td data-label="Type">{product.type}</td>
                                    <td data-label="Price">{formatPrice(product.price)}</td>
                                    <td data-label="Stock">{getTotalStock(product.variants)}</td>
                                    <td data-label="Status">
                                        <div className={styles.badges}>
                                            {product.isNew && (
                                                <span className={`${styles.badge} ${styles.new}`}>New</span>
                                            )}
                                            <span className={`${styles.badge} ${styles.stock}`}>
                                                {product.soldPercentage}% Sold
                                            </span>
                                        </div>
                                    </td>
                                    <td data-label="Actions">
                                        <div className={styles.actions}>
                                            <button 
                                                className={`${styles.actionButton} ${styles.edit}`}
                                                onClick={() => handleEdit(product)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className={`${styles.actionButton} ${styles.delete}`}
                                                onClick={() => handleDelete(product)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <MediaPreviewModal 
                media={selectedMedia}
                onClose={handleCloseModal}
                allMedia={viewingAllMedia}
                mediaItems={currentMediaItems}
            />
            <DeleteConfirmModal
                product={productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
            />
            <EditProductModal
                product={productToEdit}
                onClose={() => setProductToEdit(null)}
                onSave={handleSaveEdit}
            />
        </div>
    );
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Products Management - ReClaim Admin' },
        {
            name: 'description',
            content: 'Manage products in ReClaim store',
        },
    ];
}; 