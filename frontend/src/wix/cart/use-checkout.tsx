import { useState } from 'react';
import { useEcomApi } from '../ecom';

export interface CheckoutParams {
    /** Redirect URL after successful checkout, e.g., 'Thank You' page. */
    successUrl: string;
    /** Redirect URL if checkout is cancelled, e.g., 'Browse Products' page. */
    cancelUrl: string;
    /** Callback to handle errors that occur when redirecting to checkout. */
    onError: (error: unknown) => void;
}

export const useCheckout = ({ successUrl, cancelUrl, onError }: CheckoutParams) => {
    const ecomApi = useEcomApi();
    const [isCheckoutInProgress, setIsCheckoutInProgress] = useState(false);

    const checkout = async () => {
        setIsCheckoutInProgress(true);
        try {
            successUrl = new URL(successUrl, window.location.origin).href;
            cancelUrl = new URL(cancelUrl, window.location.origin).href;
            const { checkoutUrl } = await ecomApi.checkout({ successUrl, cancelUrl });
            window.location.assign(checkoutUrl);
        } catch (error) {
            // Only reset on error. Success will redirect to checkout page.
            setIsCheckoutInProgress(false);

            onError(error);
        }
    };

    return { checkout, isCheckoutInProgress };
};
