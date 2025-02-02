interface DeliveryPrices {
    home?: number;
    center?: number;
    return?: number;
}

export const DELIVERY_PRICES: Record<string, DeliveryPrices> = {
    'Adrar': { home: 1400, center: 900, return: 200 },
    'Chlef': { home: 750, center: 450, return: 200 },
    'Laghouat': { home: 950, center: 600, return: 200 },
    'Oum El Bouaghi': { home: 800, center: 450, return: 200 },
    'Batna': { home: 800, center: 450, return: 200 },
    'Béjaïa': { home: 800, center: 450, return: 200 },
    'Biskra': { home: 950, center: 600, return: 200 },
    'Béchar': { home: 1100, center: 650, return: 200 },
    'Blida': { home: 400, center: 300, return: 200 },
    'Bouira': { home: 750, center: 450, return: 200 },
    'Tamanrasset': { home: 1600, center: 1050, return: 250 },
    'Tébessa': { home: 850, center: 450, return: 200 },
    'Tlemcen': { home: 850, center: 500, return: 200 },
    'Tiaret': { home: 800, center: 450, return: 200 },
    'Tizi Ouzou': { home: 750, center: 450, return: 200 },
    'Alger': { home: 500, center: 300, return: 200 },
    'Djelfa': { home: 950, center: 600, return: 200 },
    'Jijel': { home: 800, center: 450, return: 200 },
    'Sétif': { home: 750, center: 450, return: 200 },
    'Saïda': { home: 800, center: 450, return: 200 },
    'Skikda': { home: 800, center: 450, return: 200 },
    'Sidi Bel Abbès': { home: 800, center: 450, return: 200 },
    'Annaba': { home: 800, center: 450, return: 200 },
    'Guelma': { home: 800, center: 450, return: 200 },
    'Constantine': { home: 800, center: 450, return: 200 },
    'Médéa': { home: 750, center: 450, return: 200 },
    'Mostaganem': { home: 800, center: 450, return: 200 },
    'M\'Sila': { home: 850, center: 500, return: 200 },
    'Mascara': { home: 800, center: 450, return: 200 },
    'Ouargla': { home: 950, center: 600, return: 200 },
    'Oran': { home: 800, center: 450, return: 200 },
    'El Bayadh': { home: 1100, center: 600, return: 200 },
    'Illizi': {},
    'Bordj Bou Arréridj': { home: 750, center: 450, return: 200 },
    'Boumerdès': { home: 750, center: 450, return: 200 },
    'El Tarf': { home: 800, center: 450, return: 200 },
    'Tindouf': {},
    'Tissemsilt': { home: 800, return: 200 },
    'El Oued': { home: 950, center: 600, return: 200 },
    'Khenchela': { home: 800, return: 200 },
    'Souk Ahras': { home: 800, center: 450, return: 200 },
    'Tipaza': { home: 750, center: 450, return: 200 },
    'Mila': { home: 800, center: 450, return: 200 },
    'Ain Defla': { home: 750, center: 450, return: 200 },
    'Naâma': { home: 1100, center: 600, return: 200 },
    'Ain Témouchent': { home: 800, center: 450, return: 200 },
    'Ghardaïa': { home: 950, center: 600, return: 200 },
    'Relizane': { home: 800, center: 450, return: 200 },
    'Timmimoun': { home: 1400, return: 200 },
    'Bordj Badji Mokhtar': {},
    'Ouled Djellal': { home: 950, center: 600, return: 200 },
    'Béni Abbès': { home: 1000, return: 200 },
    'In Salah': { home: 1600, return: 200 },
    'In Guezzam': { home: 1600, return: 200 },
    'Touggourt': { home: 950, center: 600, return: 200 },
    'Djanet': {},
    'M\'Ghair': { home: 950, return: 200 },
    'El Menia': { home: 1000, return: 200 }
};

// Helper function to check if a wilaya exists
export function isValidWilaya(wilaya: string): boolean {
    return wilaya in DELIVERY_PRICES;
}

// Helper function to check if delivery is completely unavailable for a wilaya
export function isDeliveryUnavailable(wilaya: string): boolean {
    const prices = DELIVERY_PRICES[wilaya];
    return !prices || (!prices.home && !prices.center);
}

export function isDeliveryAvailable(wilaya: string, deliveryType: 'home' | 'center'): boolean {
    const prices = DELIVERY_PRICES[wilaya];
    if (!prices) return false;
    return deliveryType === 'home' ? !!prices.home : !!prices.center;
}

export function calculateDeliveryPrice(wilaya: string, deliveryType: 'home' | 'center'): number | null {
    const prices = DELIVERY_PRICES[wilaya];
    if (!prices) return null;

    if (deliveryType === 'home') {
        return prices.home || null;
    }
    if (deliveryType === 'center') {
        return prices.center || null;
    }
    return null;
}

export function calculateTotalPrice(productPrice: number, wilaya: string, deliveryType: 'home' | 'center'): number | null {
    const deliveryPrice = calculateDeliveryPrice(wilaya, deliveryType);
    if (deliveryPrice === null) return null;
    return productPrice + deliveryPrice;
}

export function getReturnPrice(wilaya: string): number | null {
    const prices = DELIVERY_PRICES[wilaya];
    if (!prices) return null;
    return prices.return || null;
}

export function getAvailableDeliveryTypes(wilaya: string): ('home' | 'center')[] {
    const prices = DELIVERY_PRICES[wilaya];
    if (!prices) return [];
    
    const types: ('home' | 'center')[] = [];
    if (prices.home) types.push('home');
    if (prices.center) types.push('center');
    return types;
}

// Helper function to get delivery price with label, useful for UI display
export function getDeliveryPriceWithLabel(wilaya: string, deliveryType: 'home' | 'center'): { price: number; label: string } | null {
    const price = calculateDeliveryPrice(wilaya, deliveryType);
    if (price === null) return null;

    return {
        price,
        label: deliveryType === 'home' ? 'Home Delivery' : 'Center Pickup'
    };
}

export function getAllWilayas(): string[] {
    return Object.keys(DELIVERY_PRICES);
} 