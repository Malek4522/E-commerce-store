import { Product } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.data;
}

export async function createProduct(product: Omit<Product, '_id'>): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
    }
    
    const data = await response.json();
    return data.data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
    }
    
    const data = await response.json();
    return data.data;
}

export async function deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
    }
}

export async function setProductNew(id: string, isNew: boolean): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}/set-new`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isNew }),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product new status');
    }
    
    const data = await response.json();
    return data.data;
} 