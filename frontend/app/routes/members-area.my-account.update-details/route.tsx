import { ActionFunctionArgs, redirect, TypedResponse } from '@remix-run/node';
import { initializeEcomApiForRequest } from '~/src/wix/ecom/session';

export async function action({ request }: ActionFunctionArgs) {
    const api = await initializeEcomApiForRequest(request);
    const formData = await request.formData();

    const userId = formData.get('userId') as string | undefined;

    if (!userId) {
        throw new Error('Missing user id');
    }

    const firstName = formData.get('firstName') as string | undefined;
    const lastName = formData.get('lastName') as string | undefined;
    const phoneNumber = formData.get('phoneNumber') as string | undefined;

    await api.updateUser(userId, {
        contact: {
            firstName,
            lastName,
            phones: phoneNumber ? [phoneNumber] : [],
        },
    });

    return redirect('/members-area/my-account');
}

// will be called if app is run in Codux because updating user details
// requires user to be logged in but it's currently can't be done through Codux
export async function coduxAction(): ReturnType<typeof action> {
    // using redirect helper here causes warning during build process
    return new Response(null, {
        status: 302,
        headers: {
            Location: '/members-area/my-account',
        },
    }) as TypedResponse<never>;
}
