import { members } from '@wix/members';
import { LoaderResponseData } from './route';

export const loaderMockData: LoaderResponseData = {
    user: {
        loginEmail: 'john.doe@mail.com',
        loginEmailVerified: true,
        status: members.Status.APPROVED,
        contactId: 'contact_id',
        contact: {
            contactId: 'contact_id',
            firstName: 'John',
            lastName: 'Doe',
            phones: ['+1234567890'],
            emails: [],
            addresses: [
                {
                    addressLine: 'New York',
                    city: 'New York',
                    country: 'US',
                    postalCode: '100000',
                    _id: 'address_id',
                },
            ],
            customFields: {},
        },
        profile: {
            nickname: 'John Doe',
            slug: 'jogn_d',
        },
        privacyStatus: members.PrivacyStatusStatus.PRIVATE,
        activityStatus: members.ActivityStatusStatus.ACTIVE,
        lastLoginDate: new Date('2024-11-18T12:35:47Z'),
        _id: 'user_id',
        _createdDate: new Date('2024-10-28T15:11:04Z'),
        _updatedDate: new Date('2024-10-28T15:11:04.210Z'),
    },
};
