import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { getSession, destroySession } from '~/src/api/session';
import { logout } from '~/src/api/users';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    await logout();

    return redirect('/', {
        headers: {
            'Set-Cookie': await destroySession(session),
        },
    });
}
