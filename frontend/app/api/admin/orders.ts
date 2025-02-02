import { Order } from './types';
import type { Product } from './types';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
    console.error('VITE_API_URL environment variable is not set');
}

function handleAuthError(status: number) {
    if (status === 401) {
        window.location.href = '/admin/login';
    }
}

async function fetchProduct(productId: string): Promise<Product> {
    const response = await fetch(`${API_URL}/product/${productId}`, {
        method: 'GET',
        credentials: 'include'
    });

    handleAuthError(response.status);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch product');
    }

    const data = await response.json();
    return data.data;
}

export async function getOrders(): Promise<Order[]> {
    try {
        const response = await fetch(`${API_URL}/order`, {
            credentials: 'include'
        });

        handleAuthError(response.status);

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export async function updateOrderStatus(orderId: string, statusNumber: number): Promise<Order> {
    const statusMap = {
        1: 'waiting',
        2: 'delivering',
        3: 'delivered',
        4: 'canceled'
    } as const;

    try {
        const response = await fetch(`${API_URL}/order/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ status: statusMap[statusNumber as keyof typeof statusMap] })
        });

        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update order status');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

export async function deleteOrder(orderId: string): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/order/${orderId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete order');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    try {
        const response = await fetch(`${API_URL}/order/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(updates)
        });

        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update order');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
}

export async function createOrder(orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
        const payload = {
            productId: orderData.product._id,
            color: orderData.color,
            size: orderData.size,
            fullName: orderData.fullName,
            phoneNumber: orderData.phoneNumber,
            state: orderData.state,
            region: orderData.region,
            delivery: orderData.delivery,
            status: orderData.status
        };

        const response = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create order');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
} 