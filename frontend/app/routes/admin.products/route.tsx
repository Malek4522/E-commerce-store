import type { MetaFunction } from '@remix-run/react';
import { useState, useCallback, useEffect } from 'react';
import type { Product, ProductVariant, ProductLink } from '../../api/admin/types';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/admin/products';
import styles from './route.module.scss';
import ProtectedRoute from '../../components/ProtectedRoute';

const IMGBB_API_KEY = "d70392dd5af4640814b4b07ef4761aa0";

// Utility functions
const getYouTubeVideoId = (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
};

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
    const [uploading, setUploading] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

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
        
        if (editedProduct.colors.includes(newColor)) return;

        const newVariants = [...editedProduct.variants];
        editedProduct.sizes.forEach(size => {
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
        
        if (editedProduct.sizes.includes(newSize)) return;

        const newVariants = [...editedProduct.variants];
        editedProduct.colors.forEach(color => {
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    const newImage: ProductLink = {
                        url: data.data.url,
                        type: 'image'
                    };
                    return newImage;
                }
                return null;
            } catch (error) {
                console.error('Upload failed:', error);
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        const uploadedImages = results.filter((img): img is ProductLink => img !== null);
        
        setEditedProduct(prev => ({
            ...prev,
            links: [...prev.links, ...uploadedImages]
        }));
        setUploading(false);
    };

    const handleAddVideo = () => {
        if (!newVideoUrl.trim() || !newVideoUrl.includes('youtube.com')) return;

        const newVideo: ProductLink = { url: newVideoUrl, type: 'video' };
        setEditedProduct(prev => ({
            ...prev,
            links: [...prev.links, newVideo]
        }));
        setNewVideoUrl('');
    };

    const handleRemoveMedia = (index: number) => {
        setEditedProduct(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }));
    };

    const handleMoveMedia = (fromIndex: number, direction: 'up' | 'down') => {
        const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
        
        if (toIndex < 0 || toIndex >= editedProduct.links.length) return;
        
        setEditedProduct(prev => {
            const newLinks = [...prev.links];
            const [movedItem] = newLinks.splice(fromIndex, 1);
            newLinks.splice(toIndex, 0, movedItem);
            return { ...prev, links: newLinks };
        });
    };

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
                                    {editedProduct.sizes.map(size => (
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
                                {editedProduct.colors.map(color => (
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
                                        {editedProduct.sizes.map(size => (
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
                                    {editedProduct.sizes.map(size => (
                                        <td key={size}></td>
                                    ))}
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Media:</label>
                        <div className={styles.mediaUploadSection}>
                            <div className={styles.mediaInputs}>
                                <div className={styles.imageUpload}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        id="imageUpload"
                                    />
                                    <label htmlFor="imageUpload" className={styles.uploadButton}>
                                        {uploading ? 'Uploading...' : 'Upload Images'}
                                    </label>
                                </div>
                                <div className={styles.videoInput}>
                                    <input
                                        type="text"
                                        value={newVideoUrl}
                                        onChange={e => setNewVideoUrl(e.target.value)}
                                        placeholder="YouTube video URL..."
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddVideo}
                                        className={styles.addVideoButton}
                                    >
                                        Add Video
                                    </button>
                                </div>
                            </div>
                            <div className={styles.mediaPreview}>
                                {editedProduct.links.map((media, index) => (
                                    <div 
                                        key={index} 
                                        className={styles.mediaItem}
                                    >
                                        {media.type === 'image' ? (
                                            <img src={media.url} alt={`Product ${index + 1}`} />
                                        ) : (
                                            <div className={styles.videoPreview}>
                                                <img 
                                                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(media.url)}/default.jpg`}
                                                    alt="Video thumbnail"
                                                />
                                                <span className={styles.playIcon}>▶</span>
                                            </div>
                                        )}
                                        <div className={styles.mediaControls}>
                                            <button
                                                type="button"
                                                onClick={() => handleMoveMedia(index, 'up')}
                                                className={styles.moveButton}
                                                disabled={index === 0}
                                                title="Move up"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleMoveMedia(index, 'down')}
                                                className={styles.moveButton}
                                                disabled={index === editedProduct.links.length - 1}
                                                title="Move down"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMedia(index)}
                                                className={styles.removeMedia}
                                                title="Remove"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<ProductLink | null>(null);
    const [viewingAllMedia, setViewingAllMedia] = useState(false);
    const [currentMediaItems, setCurrentMediaItems] = useState<ProductLink[]>([]);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [showNewProductModal, setShowNewProductModal] = useState(false);

    // Memoize handlers to prevent unnecessary re-renders
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

    const confirmDelete = useCallback(async () => {
        if (productToDelete) {
            try {
                setError(null);
                await deleteProduct(productToDelete._id);
                setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
                setProductToDelete(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete product');
            }
        }
    }, [productToDelete]);

    const handleSaveEdit = useCallback(async (updatedProduct: Product) => {
        try {
            setError(null);
            const savedProduct = await updateProduct(updatedProduct._id, updatedProduct);
            setProducts(prev => prev.map(p => 
                p._id === savedProduct._id ? savedProduct : p
            ));
            setProductToEdit(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update product');
        }
    }, []);

    const handleAddNewProduct = useCallback(async (newProduct: Omit<Product, '_id'>) => {
        try {
            setError(null);
            const createdProduct = await createProduct(newProduct);
            setProducts(prev => [...prev, createdProduct]);
            setShowNewProductModal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create product');
        }
    }, []);

    // Memoize utility functions
    const formatPrice = useCallback((price: number) => {
        return `${(price / 100).toFixed(2)} DA`;
    }, []);

    const getTotalStock = useCallback((variants: ProductVariant[]) => {
        return variants.reduce((sum: number, variant: ProductVariant) => sum + variant.quantity, 0);
    }, []);

    const renderMediaLinks = useCallback((links: ProductLink[]) => {
        const previewItem = links[0];

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
                                    loading="lazy" // Add lazy loading
                                />
                            ) : (
                                <div className={styles.previewVideo}>
                                    <img 
                                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(previewItem.url)}/default.jpg`}
                                        alt="Video preview"
                                        className={styles.previewThumbnail}
                                        loading="lazy" // Add lazy loading
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
    }, [handleViewAllMedia]);

    // Load products only once on mount
    useEffect(() => {
        let mounted = true;

        const loadProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchProducts();
                if (mounted) {
                    setProducts(data);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load products');
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <ProtectedRoute>
            <div className={styles.productsPage}>
                <header className={styles.header}>
                    <h1>Products Management</h1>
                    <button 
                        className={styles.addButton}
                        onClick={() => setShowNewProductModal(true)}
                    >
                        Add New Product
                    </button>
                </header>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <div className={styles.content}>
                    {isLoading ? (
                        <div className={styles.loading}>Loading products...</div>
                    ) : (
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
                    )}
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
                {showNewProductModal && (
                    <EditProductModal
                        product={{
                            _id: '',
                            name: '',
                            description: '',
                            type: 'Jumpsuit',
                            price: 0,
                            variants: [],
                            soldPercentage: 0,
                            isNew: true,
                            links: [],
                            colors: [],
                            sizes: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        }}
                        onClose={() => setShowNewProductModal(false)}
                        onSave={handleAddNewProduct}
                    />
                )}
            </div>
        </ProtectedRoute>
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