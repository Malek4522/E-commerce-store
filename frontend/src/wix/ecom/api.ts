import { currentCart, orders } from '@wix/ecom';
import { members } from '@wix/members';
import { redirects } from '@wix/redirects';
import { createClient, OAuthStrategy, Tokens } from '@wix/sdk';
import { collections, products } from '@wix/stores';
import { getFilteredProductsQuery } from '../products/product-filters';
import { getSortedProductsQuery } from '../products/product-sorting';
import { EcomApi, WixApiClient } from './types';
import { isNotFoundWixClientError, normalizeWixClientError } from './wix-client-error';

/**
 * The Wix Stores App ID is the same for all websites integrating with Wix
 * Stores. It is required for API calls such as adding products to the cart.
 * - https://dev.wix.com/docs/rest/business-solutions/stores/catalog/e-commerce-integration
 */
const WIX_STORES_APP_ID = '1380b703-ce81-ff05-f115-39571d94dfcd';

/**
 * OAuth app client ID for a demo store, used to access a sample product catalog
 * until you connect your own Wix store. Once connected, this client ID is
 * ignored.
 * - https://help.codux.com/kb/en/article/connecting-your-app-to-wix-headless-services
 */
const DEMO_WIX_CLIENT_ID = '35a15d20-4732-4bb8-a8ef-194fd1166827';

/**
 * OAuth app client ID for your Wix website to access Wix APIs. It is used on
 * both the server side and client side, and it is passed from the server to the
 * client by the root loader.
 * - https://dev.wix.com/docs/go-headless/coding/java-script-sdk/visitors-and-members/create-a-client-with-oauth
 * - https://dev.wix.com/docs/go-headless/getting-started/setup/authentication/create-an-oauth-app-for-visitors-and-members
 */
let WIX_CLIENT_ID: string | undefined;

export function getWixClientId(): string {
    if (typeof process !== 'undefined' && process.env.WIX_CLIENT_ID) {
        return process.env.WIX_CLIENT_ID;
    }
    return WIX_CLIENT_ID ?? DEMO_WIX_CLIENT_ID;
}

export function setWixClientId(id: string): void {
    WIX_CLIENT_ID = id;
}

export function createWixClient(tokens?: Tokens): WixApiClient {
    return createClient({
        modules: {
            products,
            currentCart,
            redirects,
            collections,
            orders,
            members,
        },
        auth: OAuthStrategy({
            clientId: getWixClientId(),
            tokens,
        }),
    });
}

export function initializeEcomApiWithTokens(tokens: Tokens) {
    const client = createWixClient(tokens);
    return createEcomApi(client);
}

export function initializeEcomApiAnonymous() {
    const client = createWixClient();
    return createEcomApi(client);
}

const createEcomApi = (wixClient: WixApiClient): EcomApi =>
    withNormalizedWixClientErrors({
        getWixClient() {
            return wixClient;
        },
        async getProducts(params = {}) {
            let collectionId = params.categoryId;
            if (!collectionId && params.categorySlug) {
                const result = await wixClient.collections.getCollectionBySlug(params.categorySlug);
                collectionId = result.collection!._id!;
            }

            let query = wixClient.products.queryProducts();

            if (collectionId) query = query.hasSome('collectionIds', [collectionId]);
            if (params.filters) query = getFilteredProductsQuery(query, params.filters);
            if (params.sortBy) query = getSortedProductsQuery(query, params.sortBy);

            const { items, totalCount = 0 } = await query
                .skip(params.skip ?? 0)
                .limit(params.limit ?? 100)
                .find();

            return { items, totalCount };
        },

        async getProductBySlug(productSlug) {
            const { items } = await wixClient.products
                .queryProducts()
                .eq('slug', productSlug)
                .limit(1)
                .find();

            return items.at(0);
        },

        async getCart() {
            try {
                return await wixClient.currentCart.getCurrentCart();
            } catch (error) {
                // The cart object doesn't exist for new visitors until they add
                // a product to the cart.
                if (!isNotFoundWixClientError(error)) throw error;
            }
        },

        getCartTotals() {
            return wixClient.currentCart.estimateCurrentCartTotals();
        },

        async updateCartItemQuantity(id, quantity) {
            const { cart } = await wixClient.currentCart.updateCurrentCartLineItemQuantity([
                { _id: id, quantity },
            ]);
            return cart!;
        },

        async removeFromCart(id) {
            const { cart } = await wixClient.currentCart.removeLineItemsFromCurrentCart([id]);
            return cart!;
        },

        async addToCart(id, quantity, options) {
            const { cart } = await wixClient.currentCart.addToCurrentCart({
                lineItems: [
                    {
                        catalogReference: {
                            catalogItemId: id,
                            appId: WIX_STORES_APP_ID,
                            options,
                        },
                        quantity,
                    },
                ],
            });
            return cart!;
        },

        async checkout({ successUrl, cancelUrl }) {
            const { checkoutId } = await wixClient.currentCart.createCheckoutFromCurrentCart({
                channelType: currentCart.ChannelType.WEB,
            });

            const { redirectSession } = await wixClient.redirects.createRedirectSession({
                ecomCheckout: { checkoutId },
                callbacks: { postFlowUrl: cancelUrl, thankYouPageUrl: successUrl },
            });

            const checkoutUrl = redirectSession?.fullUrl;
            if (!checkoutUrl) throw new Error('Failed to retrieve checkout URL');
            return { checkoutUrl };
        },

        async getAllCategories() {
            const { items } = await wixClient.collections.queryCollections().find();
            return items;
        },

        async getCategoryBySlug(slug) {
            try {
                const { collection } = await wixClient.collections.getCollectionBySlug(slug);
                return collection!;
            } catch (error) {
                if (!isNotFoundWixClientError(error)) throw error;
            }
        },

        async getOrder(id) {
            try {
                return await wixClient.orders.getOrder(id);
            } catch (error) {
                if (!isNotFoundWixClientError(error)) throw error;
            }
        },

        async getOrders() {
            const searchOrdersResponse = await wixClient.orders.searchOrders();
            return {
                items: searchOrdersResponse.orders,
                totalCount: searchOrdersResponse.metadata?.count ?? 0,
            };
        },

        async getProductPriceBoundsInCategory(categoryId: string) {
            const query = wixClient.products.queryProducts().hasSome('collectionIds', [categoryId]);

            const [ascendingPrice, descendingPrice] = await Promise.all([
                query.ascending('price').limit(1).find(),
                query.descending('price').limit(1).find(),
            ]);

            const lowest = ascendingPrice.items[0]?.priceData?.price ?? 0;
            const highest = descendingPrice.items[0]?.priceData?.price ?? 0;
            return { lowest, highest };
        },

        async login(callbackUrl: string, returnUrl: string) {
            const oAuthData = wixClient.auth.generateOAuthData(callbackUrl, returnUrl);

            const { authUrl } = await wixClient.auth.getAuthUrl(oAuthData, {
                responseMode: 'query',
            });

            return { oAuthData, authUrl };
        },

        async logout(returnUrl: string) {
            return wixClient.auth.logout(returnUrl);
        },

        isLoggedIn() {
            return wixClient.auth.loggedIn();
        },

        async getUser() {
            const response = await wixClient.members.getCurrentMember({
                fieldsets: [members.Set.FULL],
            });
            return response.member;
        },

        async updateUser(id: string, user: members.UpdateMember) {
            // `updateMember` is not clearing contact phone number, so
            // if phone should be empty we use separate function for this
            if (!user.contact?.phones?.[0]) {
                await wixClient.members.deleteMemberPhones(id);

                if (user.contact?.phones) {
                    user.contact.phones = [];
                }
            }

            return wixClient.members.updateMember(id, user);
        },

        async sendPasswordResetEmail(email: string, redirectUrl: string) {
            await wixClient.auth.sendPasswordResetEmail(email, redirectUrl);
        },
    });

/**
 * Wraps all methods of the EcomApi with a try-catch block that fixes broken
 * error messages in WixClient errors and rethrows them.
 */
const withNormalizedWixClientErrors = (api: EcomApi): EcomApi => {
    for (const key of Object.keys(api)) {
        const original = Reflect.get(api, key);
        if (typeof original !== 'function') continue;
        Reflect.set(api, key, (...args: unknown[]) => {
            try {
                const result = Reflect.apply(original, api, args);
                if (result instanceof Promise) {
                    return result.catch((error) => {
                        throw normalizeWixClientError(error);
                    });
                }
                return result;
            } catch (error) {
                throw normalizeWixClientError(error);
            }
        });
    }
    return api;
};
