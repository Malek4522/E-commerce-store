import { Order } from '~/src/api/types';

export const mockOrders: Order[] = [
    {
        id: 'order_1',
        items: [
            {
                id: 'item_1',
                productId: 'product_1',
                productName: 'Eco-friendly Water Bottle',
                quantity: 2,
                price: {
                    amount: 29.99,
                    formattedAmount: '$29.99'
                },
                image: {
                    url: '/images/water-bottle.jpg',
                    altText: 'Eco-friendly Water Bottle'
                }
            }
        ],
        priceSummary: {
            subtotal: { amount: 59.98, formattedAmount: '$59.98' },
            shipping: { amount: 5.99, formattedAmount: '$5.99' },
            tax: { amount: 6.60, formattedAmount: '$6.60' },
            total: { amount: 72.57, formattedAmount: '$72.57' }
        },
        shippingInfo: {
            address: {
                addressLine1: '123 Main St',
                city: 'New York',
                state: 'NY',
                postalCode: '10001',
                country: 'US'
            },
            contact: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890'
            }
        },
        billingInfo: {
            address: {
                addressLine1: '123 Main St',
                city: 'New York',
                state: 'NY',
                postalCode: '10001',
                country: 'US'
            },
            contact: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890'
            }
        },
        status: 'completed',
        createdAt: '2024-02-01T12:00:00Z'
    }
];
