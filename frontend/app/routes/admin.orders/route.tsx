import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { getOrders, updateOrderStatus, deleteOrder, updateOrder, createOrder } from '../../api/admin/orders';
import { getProducts } from '../../api/admin/products';
import { 
    calculateDeliveryPrice, 
    calculateTotalPrice, 
    getAvailableDeliveryTypes,
    getAllWilayas
} from '../../utils/delivery-prices';
import styles from './route.module.scss';
import { toast } from '~/src/components/toast/toast';

type OrderStatus = 'waiting' | 'delivering' | 'delivered' | 'canceled';

interface AdminProductLink {
    url: string;
    type: 'video' | 'image';
}

interface AdminProductVariant {
    size: string;
    color: string;
    quantity: number;
}

interface AdminProduct {
    _id: string;
    name: string;
    price: number;
    soldPrice?: number;
    links: AdminProductLink[];
    slug: string;
    variants: AdminProductVariant[];
    colors: string[];
    sizes: string[];
}

interface ApiOrder {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        soldPrice?: number;
        links: AdminProductLink[];
        slug: string;
        variants: AdminProductVariant[];
        colors: string[];
        sizes: string[];
        quantity?: number;
    };
    fullName: string;
    phoneNumber: string;
    state: string;
    region: string;
    delivery: 'home' | 'center';
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    color: string;
    size: string;
}

interface AdminOrder {
    _id: string;
    product: AdminProduct & { quantity: number };
    fullName: string;
    phoneNumber: string;
    state: string;
    region: string;
    delivery: 'home' | 'center';
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    color: string;
    size: string;
}

function mapApiOrderToAdminOrder(apiOrder: ApiOrder): AdminOrder {
    return {
        _id: apiOrder._id,
        product: {
            ...apiOrder.product,
            quantity: apiOrder.product.quantity || 1
        },
        fullName: apiOrder.fullName,
        phoneNumber: apiOrder.phoneNumber,
        state: apiOrder.state,
        region: apiOrder.region,
        delivery: apiOrder.delivery,
        status: apiOrder.status,
        createdAt: apiOrder.createdAt,
        updatedAt: apiOrder.updatedAt,
        color: apiOrder.color,
        size: apiOrder.size
    };
}

function mapApiProductToAdminProduct(apiProduct: any): AdminProduct {
    return {
        _id: apiProduct._id,
        name: apiProduct.name,
        price: apiProduct.price,
        soldPrice: apiProduct.soldPrice,
        links: apiProduct.links || [],
        slug: apiProduct.slug || apiProduct.name.toLowerCase().replace(/ /g, '-'),
        variants: apiProduct.variants || [],
        colors: apiProduct.colors || [],
        sizes: apiProduct.sizes || []
    };
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
    const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
    const [isAddingOrder, setIsAddingOrder] = useState(false);
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [newOrder, setNewOrder] = useState<Omit<AdminOrder, '_id' | 'createdAt' | 'updatedAt'> | null>(null);
    const [searchFilters, setSearchFilters] = useState({
        query: '',
        status: '',
        state: '',
        dateRange: 'all'
    });
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const _navigate = useNavigate();

    const loadOrders = useCallback(async () => {
        try {
            const data = await getOrders();
            const ordersWithProducts = data.map(order => mapApiOrderToAdminOrder(order));
            setOrders(ordersWithProducts);
            setError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load orders';
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadProducts = useCallback(async () => {
        try {
            const data = await getProducts();
            const mappedProducts = data.map(product => mapApiProductToAdminProduct(product));
            setProducts(mappedProducts);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load products';
            toast.error(message);
            setError(message);
        }
    }, []);

    useEffect(() => {
        loadOrders();
        loadProducts();
    }, [loadOrders, loadProducts]);

    useEffect(() => {
        if (selectedProductId) {
            const product = products.find(p => p._id === selectedProductId);
            if (!product) return;

            // Find first available variant
            const firstAvailableVariant = product.variants.find(v => v.quantity > 0);
            if (!firstAvailableVariant) return;

            const newOrderData: Omit<AdminOrder, '_id' | 'createdAt' | 'updatedAt'> = {
                product: {
                    _id: product._id,
                    name: product.name,
                    price: Number(product.price), // Ensure price is a number
                    soldPrice: product.soldPrice,
                    links: product.links || [],
                    slug: product.name.toLowerCase().replace(/ /g, '-'),
                    variants: product.variants,
                    colors: product.colors,
                    sizes: product.sizes,
                    quantity: 1
                },
                color: firstAvailableVariant.color,
                size: firstAvailableVariant.size,
                fullName: '',
                phoneNumber: '',
                state: 'Alger',
                region: '',
                delivery: 'home' as const,
                status: 'waiting'
            };
            setNewOrder(newOrderData);
        } else {
            setNewOrder(null);
        }
    }, [selectedProductId, products]);

    // Helper function to ensure product price is a number
    function ensureOrderPrice(order: AdminOrder): AdminOrder {
        const result = {
            ...order,
            product: {
                ...order.product,
                price: Number(order.product.price)
            }
        };
        return result;
    }

    async function handleStatusUpdate(orderId: string, statusNumber: number) {
        try {
            const existingOrder = orders.find(o => o._id === orderId);
            if (!existingOrder) return;

            const updatedOrder = await updateOrderStatus(orderId, statusNumber);
            const mappedOrder = mapApiOrderToAdminOrder({
                ...existingOrder,
                status: updatedOrder.status,
                updatedAt: updatedOrder.updatedAt
            } as ApiOrder);
            
            setOrders(orders.map(order => 
                order._id === mappedOrder._id ? mappedOrder : order
            ));
            setError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update order status';
            toast.error(message);
            setError(message);
        }
    }

    async function handleDeleteOrder(orderId: string) {
        if (!window.confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            await deleteOrder(orderId);
            setOrders(orders.filter(order => order._id !== orderId));
            setError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete order';
            toast.error(message);
            setError(message);
        }
    }

    async function handleUpdateOrder(order: AdminOrder) {
        try {
            const updatedOrder = await updateOrder(order._id, {
                fullName: order.fullName,
                phoneNumber: order.phoneNumber,
                state: order.state,
                region: order.region,
                delivery: order.delivery,
                status: order.status,
                color: order.color,
                size: order.size
            });
            
            const mappedOrder = mapApiOrderToAdminOrder({
                ...order,
                ...updatedOrder,
                product: {
                    ...order.product,
                    quantity: order.product.quantity
                }
            } as ApiOrder);
            
            setOrders(orders.map(o => o._id === mappedOrder._id ? mappedOrder : o));
            setEditingOrder(null);
            setEditingProduct(null);
            setError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update order';
            toast.error(message);
            setError(message);
        }
    }

    function handleEditClick(order: AdminOrder) {
        setEditingOrder(order);
        setEditingProduct(order.product as unknown as AdminProduct);
    }

    async function handleAddOrder(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedProductId || !newOrder) return;

        try {
            setError(null);
            const createdOrder = await createOrder(newOrder);
            const mappedOrder = mapApiOrderToAdminOrder({
                ...createdOrder,
                product: {
                    ...createdOrder.product,
                    quantity: newOrder.product.quantity
                }
            } as ApiOrder);
            
            setOrders([mappedOrder, ...orders]);
            setIsAddingOrder(false);
            setSelectedProductId('');
            setNewOrder(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add order';
            toast.error(message);
            setError(message);
        }
    }

    function formatPrice(price: number | undefined | null): string {
        if (price === undefined || price === null || isNaN(price)) return '0,00 DA';
        const [whole, decimal] = price.toFixed(2).split('.');
        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return `${formattedWhole},${decimal} DA`;
    }

    function calculateTotalWithFallback(productPrice: number | undefined | null, state: string, delivery: 'home' | 'center', soldPrice?: number): number {
        const basePrice = (soldPrice !== undefined && soldPrice > 0) ? soldPrice : (productPrice ?? 0);
        if (basePrice === 0) return 0;
        const deliveryPrice = calculateDeliveryPrice(state, delivery);
        if (deliveryPrice === null) return basePrice;
        return basePrice + deliveryPrice;
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case 'waiting': return styles.statusWaiting;
            case 'delivering': return styles.statusDelivering;
            case 'delivered': return styles.statusDelivered;
            case 'canceled': return styles.statusCanceled;
            default: return '';
        }
    }

    function filterOrders(orders: AdminOrder[]): AdminOrder[] {
        return orders.filter(order => {
            try {
                const matchesQuery = searchFilters.query.toLowerCase().trim() === '' ||
                    order.fullName.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
                    order.phoneNumber.includes(searchFilters.query) ||
                    order.product.name.toLowerCase().includes(searchFilters.query.toLowerCase());

                const matchesStatus = searchFilters.status === '' || order.status === searchFilters.status;
                const matchesState = searchFilters.state === '' || order.state === searchFilters.state;

                let matchesDate = true;
                if (searchFilters.dateRange !== 'all') {
                    const orderDate = new Date(order.createdAt);
                    const now = new Date();
                    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

                    switch (searchFilters.dateRange) {
                        case 'today':
                            matchesDate = daysDiff === 0;
                            break;
                        case 'week':
                            matchesDate = daysDiff <= 7;
                            break;
                        case 'month':
                            matchesDate = daysDiff <= 30;
                            break;
                    }
                }

                return matchesQuery && matchesStatus && matchesState && matchesDate;
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Error filtering orders';
                toast.error(message);
                return false;
            }
        });
    }

    return (
        <div className={styles.ordersPage}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <h1>Admin Dashboard</h1>
                        <nav className={styles.nav}>
                            <Link to="/admin/orders" className={`${styles.navLink} ${styles.active}`}>
                                Orders
                            </Link>
                            <Link to="/admin/products" className={styles.navLink}>
                                Products
                            </Link>
                        </nav>
                    </div>
                    <button 
                        onClick={() => setIsAddingOrder(true)}
                        className={styles.addButton}
                    >
                        Add Order
                    </button>
                </div>
            </header>
            <div className={styles.content}>
                {error && (
                    <div className={styles.error}>
                        {error}
                        <button onClick={loadOrders}>Retry</button>
                    </div>
                )}
                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search by customer name, phone, or product..."
                            value={searchFilters.query}
                            onChange={(e) => setSearchFilters({
                                ...searchFilters,
                                query: e.target.value
                            })}
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.filters}>
                        <select
                            value={searchFilters.status}
                            onChange={(e) => setSearchFilters({
                                ...searchFilters,
                                status: e.target.value
                            })}
                            className={styles.filterSelect}
                        >
                            <option value="">All Status</option>
                            <option value="waiting">Waiting</option>
                            <option value="delivering">Delivering</option>
                            <option value="delivered">Delivered</option>
                            <option value="canceled">Canceled</option>
                        </select>
                        <select
                            value={searchFilters.state}
                            onChange={(e) => setSearchFilters({
                                ...searchFilters,
                                state: e.target.value
                            })}
                            className={styles.filterSelect}
                        >
                            <option value="">All States</option>
                            {getAllWilayas().map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                        <select
                            value={searchFilters.dateRange}
                            onChange={(e) => setSearchFilters({
                                ...searchFilters,
                                dateRange: e.target.value
                            })}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="lastWeek">Last 7 Days</option>
                            <option value="lastMonth">Last 30 Days</option>
                        </select>
                    </div>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Customer</th>
                                <th>Contact</th>
                                <th>Region</th>
                                <th>State</th>
                                <th>Delivery</th>
                                <th>Price</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className={styles.emptyState}>
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className={styles.emptyState}>
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filterOrders(orders).map(order => {
                                    const _deliveryPrice = calculateDeliveryPrice(order.state, order.delivery);
                                    const _totalPrice = calculateTotalPrice(order.product.price, order.state, order.delivery);
                                    
                                    return (
                                        <tr key={order._id}>
                                            <td>
                                                <div className={styles.product}>
                                                    <img 
                                                        src={order.product.links?.find(l => l.type === 'image')?.url || ''} 
                                                        alt={order.product.name}
                                                        className={styles.productImage} 
                                                    />
                                                    <div>
                                                        <Link to={`/admin/products?id=${order.product._id}`}>
                                                            {order.product.name}
                                                        </Link>
                                                        <div className={styles.productMeta}>
                                                            Color: {order.color} | Size: {order.size}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={styles.customer}>{order.fullName}</td>
                                            <td className={styles.contact}>{order.phoneNumber}</td>
                                            <td className={styles.region}>{order.region}</td>
                                            <td className={styles.state}>{order.state}</td>
                                            <td className={styles.delivery}>
                                                <div className={styles.availableTypes}>
                                                    {getAvailableDeliveryTypes(order.state).map(type => (
                                                        <button
                                                            key={type}
                                                            value={type}
                                                            onClick={async () => {
                                                                // Skip if clicking on already selected delivery type
                                                                if (order.delivery === type) return;
                                                                
                                                                try {
                                                                    // Only send necessary fields for update
                                                                    const updatedOrder = await updateOrder(order._id, {
                                                                        delivery: type,
                                                                        state: order.state
                                                                    });
                                                                    // Merge the response with existing order data
                                                                    const mergedOrder = {
                                                                        ...order,
                                                                        delivery: updatedOrder.delivery,
                                                                        updatedAt: updatedOrder.updatedAt
                                                                    };
                                                                    const processedOrder = ensureOrderPrice(mergedOrder);
                                                                    setOrders(orders.map(o => 
                                                                        o._id === processedOrder._id ? processedOrder : o
                                                                    ));
                                                                } catch (err) {
                                                                    setError('Failed to update delivery type');
                                                                }
                                                            }}
                                                            className={`${styles.availableType} ${order.delivery === type ? styles.selected : ''}`}
                                                        >
                                                            {type === 'home' ? 'Home Delivery' : 'Center Pickup'}
                                                        </button>
                                                    ))}
                                                    {getAvailableDeliveryTypes(order.state).length === 0 && (
                                                        <span className={styles.unavailable}>
                                                            Not Available
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={styles.price}>
                                                <div>
                                                    Product: {formatPrice(order.product?.soldPrice && order.product.soldPrice > 0 ? order.product.soldPrice : order.product?.price)}
                                                    {order.product?.soldPrice && order.product.soldPrice > 0 && (
                                                        <div className={styles.originalPrice}>
                                                            Original: {formatPrice(order.product.price)}
                                                        </div>
                                                    )}
                                                </div>
                                                {_deliveryPrice !== null && (
                                                    <div>
                                                        Delivery: {formatPrice(_deliveryPrice)}
                                                    </div>
                                                )}
                                                <div className={styles.total}>
                                                    Total: {formatPrice(calculateTotalWithFallback(
                                                        order.product?.price,
                                                        order.state,
                                                        order.delivery,
                                                        order.product?.soldPrice
                                                    ))}
                                                </div>
                                                {_deliveryPrice === null && (
                                                    <div className={styles.warning}>
                                                        Delivery not available
                                                    </div>
                                                )}
                                            </td>
                                            <td className={styles.date}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={`${styles.status} ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <select 
                                                        value={
                                                            order.status === 'waiting' ? '1' :
                                                            order.status === 'delivering' ? '2' :
                                                            order.status === 'delivered' ? '3' :
                                                            '4'
                                                        }
                                                        onChange={(e) => handleStatusUpdate(order._id, parseInt(e.target.value))}
                                                        className={styles.statusSelect}
                                                    >
                                                        <option value="1">Waiting</option>
                                                        <option value="2">Delivering</option>
                                                        <option value="3">Delivered</option>
                                                        <option value="4">Canceled</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleEditClick(order)}
                                                        className={`${styles.actionButton} ${styles.edit}`}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className={`${styles.actionButton} ${styles.delete}`}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Order Modal */}
            {isAddingOrder && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Add New Order</h2>
                        <form onSubmit={handleAddOrder}>
                            <div className={styles.formGroup}>
                                <label htmlFor="product-select">Select Product</label>
                                <div 
                                    id="product-select"
                                    className={styles.customSelect}
                                >
                                    <div 
                                        className={styles.selectedProduct}
                                        onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                                    >
                                        {selectedProductId ? (
                                            <div className={styles.productOption}>
                                                <img 
                                                    src={products.find(p => p._id === selectedProductId)?.links?.find(l => l.type === 'image')?.url || ''} 
                                                    alt={products.find(p => p._id === selectedProductId)?.name}
                                                />
                                                <div className={styles.productInfo}>
                                                    <span className={styles.productName}>
                                                        {products.find(p => p._id === selectedProductId)?.name}
                                                    </span>
                                                    <span>
                                                        {formatPrice(products.find(p => p._id === selectedProductId)?.price || 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className={styles.placeholder}>Choose a product...</span>
                                        )}
                                        <span className={styles.arrow}>▼</span>
                                    </div>
                                    {isProductDropdownOpen && (
                                        <div className={styles.dropdown}>
                                            {products.map(product => (
                                                <div 
                                                    key={product._id}
                                                    className={`${styles.productOption} ${selectedProductId === product._id ? styles.selected : ''}`}
                                                    onClick={() => {
                                                        setSelectedProductId(product._id);
                                                        setIsProductDropdownOpen(false);
                                                    }}
                                                >
                                                    <img 
                                                        src={product.links?.find(l => l.type === 'image')?.url || ''} 
                                                        alt={product.name}
                                                    />
                                                    <div className={styles.productInfo}>
                                                        <span className={styles.productName}>{product.name}</span>
                                                        <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {selectedProductId && newOrder && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="customer-name">Customer Name</label>
                                        <input
                                            id="customer-name"
                                            type="text"
                                            value={newOrder.fullName}
                                            onChange={(e) => setNewOrder({
                                                ...newOrder,
                                                fullName: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone-number">Phone Number</label>
                                        <input
                                            id="phone-number"
                                            type="text"
                                            value={newOrder.phoneNumber}
                                            onChange={(e) => setNewOrder({
                                                ...newOrder,
                                                phoneNumber: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="state-select">State (Wilaya)</label>
                                        <select
                                            id="state-select"
                                            value={newOrder.state}
                                            onChange={(e) => {
                                                const newState = e.target.value;
                                                const availableTypes = getAvailableDeliveryTypes(newState);
                                                setNewOrder({
                                                    ...newOrder,
                                                    state: newState,
                                                    delivery: availableTypes.includes(newOrder.delivery) 
                                                        ? newOrder.delivery 
                                                        : (availableTypes[0] || newOrder.delivery)
                                                });
                                            }}
                                            className={styles.wilayaSelect}
                                            required
                                        >
                                            {getAllWilayas().map(state => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="region-input">Region (Area/District)</label>
                                        <input
                                            id="region-input"
                                            type="text"
                                            value={newOrder.region}
                                            onChange={(e) => setNewOrder({
                                                ...newOrder,
                                                region: e.target.value
                                            })}
                                            placeholder="Enter your area/district"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="delivery-type">Delivery Type</label>
                                        <div id="delivery-type" className={styles.deliveryOptions}>
                                            {getAvailableDeliveryTypes(newOrder.state).length > 0 ? (
                                                <>
                                                    {getAvailableDeliveryTypes(newOrder.state).map(type => (
                                                        <label key={type} className={styles.deliveryOption}>
                                                            <input
                                                                type="radio"
                                                                name="deliveryType"
                                                                value={type}
                                                                checked={newOrder.delivery === type}
                                                                onChange={(e) => setNewOrder({
                                                                    ...newOrder,
                                                                    delivery: e.target.value as 'home' | 'center'
                                                                })}
                                                                required
                                                            />
                                                            <span className={styles[type]}>
                                                                {type === 'home' ? 'Home Delivery' : 'Center Pickup'}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className={styles.noDelivery}>
                                                    No delivery options available for this state
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Add Price Summary */}
                                    <div className={styles.priceSummary}>
                                        <div className={styles.priceRow}>
                                            <span>Product Price:</span>
                                            <span>{formatPrice(newOrder.product.price)}</span>
                                        </div>
                                        {(() => {
                                            const deliveryPrice = calculateDeliveryPrice(newOrder.state, newOrder.delivery);
                                            const totalPrice = calculateTotalPrice(newOrder.product.price, newOrder.state, newOrder.delivery);
                                            return (
                                                <>
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
                                                </>
                                            );
                                        })()}
                                    </div>
                                </>
                            )}
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.saveButton}>
                                    Create Order
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingOrder(false);
                                        setSelectedProductId('');
                                    }}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingOrder && editingProduct && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Edit Customer Information</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateOrder(editingOrder);
                        }}>
                            {/* Product Info Display */}
                            <div className={styles.formGroup}>
                                <label htmlFor="product-details">Product Details</label>
                                <div id="product-details" className={styles.productInfo}>
                                    <img 
                                        src={editingProduct.links?.find(l => l.type === 'image')?.url || ''} 
                                        alt={editingProduct.name}
                                        className={styles.productImage}
                                    />
                                </div>
                            </div>

                            {/* Size and Color Selection */}
                            <div className={styles.formGroup}>
                                <label htmlFor="edit-product-size">Size</label>
                                <select
                                    id="edit-product-size"
                                    value={editingOrder.size}
                                    onChange={(e) => {
                                        const newSize = e.target.value;
                                        // Find available colors for this size
                                        const availableColors = editingProduct.variants
                                            .filter((v: AdminProductVariant) => v.size === newSize && v.quantity > 0)
                                            .map((v: AdminProductVariant) => v.color);
                                        
                                        setEditingOrder({
                                            ...editingOrder,
                                            size: newSize,
                                            // Keep current color if available, otherwise use first available color
                                            color: availableColors.includes(editingOrder.color) ? 
                                                editingOrder.color : availableColors[0]
                                        });
                                    }}
                                    required
                                >
                                    {Array.from(new Set(
                                        editingProduct.variants
                                            .filter(v => v.quantity > 0)
                                            .map(v => v.size)
                                    )).map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.variantGroup}>
                                <label htmlFor="edit-product-color">Color</label>
                                <select
                                    id="edit-product-color"
                                    value={editingOrder.color}
                                    onChange={(e) => {
                                        setEditingOrder({
                                            ...editingOrder,
                                            color: e.target.value
                                        });
                                    }}
                                    required
                                >
                                    {editingProduct.variants
                                        .filter(v => v.size === editingOrder.size && v.quantity > 0)
                                        .map(v => (
                                            <option key={v.color} value={v.color}>
                                                {v.color} ({v.quantity} in stock)
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="customer-name">Customer Name</label>
                                <input
                                    id="customer-name"
                                    type="text"
                                    value={editingOrder.fullName}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder,
                                        fullName: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone-number">Phone Number</label>
                                <input
                                    id="phone-number"
                                    type="text"
                                    value={editingOrder.phoneNumber}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder,
                                        phoneNumber: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="edit-region">Region (Area/District)</label>
                                <input
                                    id="edit-region"
                                    type="text"
                                    value={editingOrder.region}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder,
                                        region: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="state-select">State (Wilaya)</label>
                                <select
                                    id="state-select"
                                    value={editingOrder.state}
                                    onChange={(e) => {
                                        const newState = e.target.value;
                                        const availableTypes = getAvailableDeliveryTypes(newState);
                                        setEditingOrder({
                                            ...editingOrder,
                                            state: newState,
                                            // Update delivery type if current one isn't available in new state
                                            delivery: availableTypes.includes(editingOrder.delivery) 
                                                ? editingOrder.delivery 
                                                : (availableTypes[0] || editingOrder.delivery)
                                        });
                                    }}
                                    required
                                >
                                    {getAllWilayas().map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Add Price Summary in Edit Modal */}
                            <div className={styles.priceSummary}>
                                <div className={styles.priceRow}>
                                    <span>Product Price:</span>
                                    <span>
                                        {editingOrder.product.soldPrice && editingOrder.product.soldPrice > 0 ? (
                                            <>
                                                {formatPrice(editingOrder.product.soldPrice)}
                                                <div className={styles.originalPrice}>
                                                    Original: {formatPrice(editingOrder.product.price)}
                                                </div>
                                            </>
                                        ) : (
                                            formatPrice(editingOrder.product.price)
                                        )}
                                    </span>
                                </div>
                                {(() => {
                                    const deliveryPrice = calculateDeliveryPrice(editingOrder.state, editingOrder.delivery);
                                    return (
                                        <>
                                            {deliveryPrice !== null && (
                                                <div className={styles.priceRow}>
                                                    <span>Delivery Price:</span>
                                                    <span>{formatPrice(deliveryPrice)}</span>
                                                </div>
                                            )}
                                            <div className={`${styles.priceRow} ${styles.total}`}>
                                                <span>Total Price:</span>
                                                <span>{formatPrice(calculateTotalWithFallback(
                                                    editingOrder.product.price,
                                                    editingOrder.state,
                                                    editingOrder.delivery,
                                                    editingOrder.product.soldPrice
                                                ))}</span>
                                            </div>
                                            {deliveryPrice === null && (
                                                <div className={styles.warning}>
                                                    Delivery not available in this state
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.saveButton}>
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingOrder(null);
                                        setEditingProduct(null);
                                    }}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}