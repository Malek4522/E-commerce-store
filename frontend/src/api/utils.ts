import { useCallback } from 'react';
import { useSearchParams } from '@remix-run/react';

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
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

// URL and search params utilities
export function removeQueryStringFromUrl(url: string): string {
    return url.split('?')[0];
}

export function mergeUrlSearchParams(
    target: URLSearchParams,
    source: URLSearchParams,
): URLSearchParams {
    const merged = new URLSearchParams(target);
    for (const [key, value] of source.entries()) {
        merged.set(key, value);
    }
    return merged;
}

export function useSearchParamsOptimistic() {
    const [searchParams, setSearchParams] = useSearchParams();

    const setSearchParamsOptimistic = useCallback(
        (nextInit: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => {
            const nextSearchParams =
                typeof nextInit === 'function' ? nextInit(searchParams) : nextInit;
            setSearchParams(nextSearchParams, { preventScrollReset: true });
        },
        [searchParams, setSearchParams],
    );

    return [searchParams, setSearchParamsOptimistic] as const;
}

// Accessibility utilities
export function getClickableElementAttributes(onClick?: () => void) {
    if (!onClick) return {};

    return {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
            }
        },
    };
}

// Debounce utility
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    wait: number,
): T {
    return useCallback(
        debounce(callback, wait),
        [callback, wait],
    ) as T;
}

function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function debounced(this: any, ...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), wait);
    };
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
export function alignRangeToNiceStep(min: number, max: number, step: number) {
    return {
        min: Math.floor(min / step) * step,
        max: Math.ceil(max / step) * step,
    };
} 