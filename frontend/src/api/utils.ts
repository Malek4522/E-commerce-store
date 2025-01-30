import { useCallback, useRef } from 'react';

// Error handling
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

// Cart utilities
export function getCartItemCount(cart: { items: Array<{ quantity: number }> } | null): number {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
}

// Price formatting
export function formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(price);
}

// URL and search params utilities
export function mergeUrlSearchParams(...searchParams: URLSearchParams[]): URLSearchParams {
    const merged = new URLSearchParams();
    for (const params of searchParams) {
        for (const [key, value] of params.entries()) {
            merged.append(key, value);
        }
    }
    return merged;
}

// Accessibility utilities
export function getClickableElementAttributes(onClick: () => void) {
    return {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        },
    };
}

// Debounce utility
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    wait: number
): T {
    const timeout = useRef<NodeJS.Timeout>();
    
    return useCallback(
        (...args: Parameters<T>) => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            
            timeout.current = setTimeout(() => {
                callback(...args);
            }, wait);
        },
        [callback, wait]
    ) as T;
}

// Product image URL utility
export function getProductImageUrl(product: { images: string[] }, options: { size?: number } = {}): string {
    if (!product.images?.length) {
        return '/placeholder-image.jpg';
    }
    
    const imageUrl = product.images[0];
    if (!options.size) return imageUrl;
    
    // Add size parameters to URL if needed
    // This depends on your image hosting service
    return imageUrl;
}

// Range alignment utility
export function alignRangeToNiceStep(min: number, max: number, step: number): { min: number; max: number } {
    return {
        min: Math.floor(min / step) * step,
        max: Math.ceil(max / step) * step,
    };
} 