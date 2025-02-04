import type { Product } from './types';
import { getErrorMessage } from '~/src/api/utils';
import { toast } from '~/src/components/toast/toast';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
    toast.error('VITE_API_URL environment variable is not set');
}

function handleAuthError(status: number) {
    if (status === 401) {
        window.location.href = '/admin/login';
    }
}

export async function fetchProducts(): Promise<Product[]> {
    try {
        const response = await fetch(`${API_URL}/product/admin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const { data } = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format: expected an array of products');
        }
        return data;
    } catch (error) {
        throw getErrorMessage(error);
    }
}

export async function createProduct(product: Omit<Product, '_id'>): Promise<Product> {
    try {
        const response = await fetch(`${API_URL}/product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(product),
        });
        
        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create product');
        }
        
        const { data } = await response.json();
        return data;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create product';
        toast.error(message);
        throw error;
    }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
        const response = await fetch(`${API_URL}/product/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(product),
        });
        
        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update product');
        }
        
        const { data } = await response.json();
        return data;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update product';
        toast.error(message);
        throw error;
    }
}

export async function deleteProduct(id: string): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/product/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        
        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete product');
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete product';
        toast.error(message);
        throw error;
    }
}

export async function setProductNew(id: string, isNew: boolean): Promise<Product> {
    try {
        const response = await fetch(`${API_URL}/product/${id}/set-new`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ isNew }),
        });
        
        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update product new status');
        }
        
        const { data } = await response.json();
        return data;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update product status';
        toast.error(message);
        throw error;
    }
}

export async function getProduct(id: string): Promise<Product> {
    try {
        const response = await fetch(`${API_URL}/product/${id}`, {
            credentials: 'include'
        });

        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch product');
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch product';
        toast.error(message);
        throw error;
    }
}

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await fetch(`${API_URL}/product/admin`, {
            credentials: 'include'
        });

        handleAuthError(response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch products');
        }

        const { data } = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format: expected an array of products');
        }
        return data;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch products';
        toast.error(message);
        throw error;
    }
} 