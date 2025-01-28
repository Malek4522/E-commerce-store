import { cart, currentCart, orders } from '@wix/ecom';
import { members } from '@wix/members';
import { redirects } from '@wix/redirects';
import { IOAuthStrategy, OauthData, WixClient } from '@wix/sdk';
import { collections, products } from '@wix/stores';

export type Product = products.Product;
export type Collection = collections.Collection;
export type CollectionDetails = collections.Collection & collections.CollectionNonNullableFields;
export type Cart = currentCart.Cart & currentCart.CartNonNullableFields;
export type CartItem = cart.LineItem;
export type CartItemDetails = cart.LineItem & cart.CartNonNullableFields['lineItems'][0];
export type CartTotals = currentCart.EstimateTotalsResponse &
    currentCart.EstimateTotalsResponseNonNullableFields;
export type OrderDetails = orders.Order & orders.OrderNonNullableFields;
export type Member = members.Member & members.MemberNonNullableFields;

export enum ProductFilter {
    minPrice = 'minPrice',
    maxPrice = 'maxPrice',
    search = 'search',
}

export interface IProductFilters {
    /**
     * Only products with a price greater than or equal to this value will be included.
     */
    [ProductFilter.minPrice]?: number;
    /**
     * Only products with a price less than or equal to this value will be included.
     */
    [ProductFilter.maxPrice]?: number;

    /**
     * Only products with a title containing this value will be included.
     */
    [ProductFilter.search]?: string;
}

export enum ProductSortBy {
    newest = 'newest',
    priceAsc = 'priceAsc',
    priceDesc = 'priceDesc',
    nameAsc = 'nameAsc',
    nameDesc = 'nameDesc',
}

export interface GetProductsOptions {
    categoryId?: string;
    categorySlug?: string;
    skip?: number;
    limit?: number;
    filters?: IProductFilters;
    sortBy?: ProductSortBy;
}

export type AddToCartOptions =
    | { variantId: string }
    | { options: Record<string, string | undefined> };

export type WixApiClient = WixClient<
    undefined,
    IOAuthStrategy,
    {
        products: typeof products;
        currentCart: typeof currentCart;
        redirects: typeof redirects;
        collections: typeof collections;
        orders: typeof orders;
        members: typeof members;
    }
>;

/**
 * Provides access to Wix Headless eCommerce API.
 * @see https://www.wix.com/studio/developers/headless
 */
export type EcomApi = {
    getWixClient(): WixApiClient;
    getProducts: (
        options?: GetProductsOptions,
    ) => Promise<{ items: Product[]; totalCount: number }>;
    getProductBySlug: (slug: string) => Promise<Product | undefined>;
    getCart: () => Promise<Cart | undefined>;
    getCartTotals: () => Promise<CartTotals>;
    updateCartItemQuantity: (id: string, quantity: number) => Promise<Cart>;
    addToCart: (id: string, quantity: number, options?: AddToCartOptions) => Promise<Cart>;
    removeFromCart: (id: string) => Promise<Cart>;
    checkout: (params: {
        /** Redirect URL after successful checkout, e.g., 'Thank You' page. */
        successUrl: string;
        /** Redirect URL if checkout is cancelled, e.g., 'Browse Products' page. */
        cancelUrl: string;
    }) => Promise<{ checkoutUrl: string }>;
    getAllCategories: () => Promise<Collection[]>;
    getCategoryBySlug: (slug: string) => Promise<CollectionDetails | undefined>;
    getOrder: (id: string) => Promise<OrderDetails | undefined>;
    getOrders: () => Promise<{
        items: OrderDetails[];
        totalCount: number;
    }>;
    /**
     * Returns the lowest and the highest product price in the category.
     */
    getProductPriceBoundsInCategory: (
        categoryId: string,
    ) => Promise<{ lowest: number; highest: number }>;
    login: (
        callbackUrl: string,
        returnUrl: string,
    ) => Promise<{
        oAuthData: OauthData;
        authUrl: string;
    }>;
    logout: (returnUrl: string) => Promise<{ logoutUrl: string }>;
    isLoggedIn: () => boolean;
    getUser: () => Promise<Member | undefined>;
    updateUser: (id: string, user: members.UpdateMember) => Promise<Member>;
    sendPasswordResetEmail(email: string, redirectUrl: string): Promise<void>;
};
