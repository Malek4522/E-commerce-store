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

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/product/admin`, {
        credentials: 'include'
    });

    handleAuthError(response.status);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch products');
    }

    const data = await response.json();
    return data.data;
}

export async function createProduct(product: Omit<Product, '_id'>): Promise<Product> {
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
    
    const data = await response.json();
    return data.data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
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
    
    const data = await response.json();
    return data.data;
}

export async function deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/product/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    
    handleAuthError(response.status);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
    }
}

export async function setProductNew(id: string, isNew: boolean): Promise<Product> {
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
    
    const data = await response.json();
    return data.data;
}

export async function getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/product/admin/${id}`, {
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

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/product/admin`, {
        credentials: 'include'
    });

    handleAuthError(response.status);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch products');
    }

    const data = await response.json();
    return data.data;
} 