import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { getSession, commitSession } from '~/src/api/session';
import { login } from '~/src/api/users';

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
        return redirect('/login');
    }

    try {
        const { token, user } = await login(code, state);
        const session = await getSession(request);
        session.set('token', token);
        session.set('userId', user.id);

        return redirect('/members-area/my-account', {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    } catch (error) {
        return redirect('/login');
    }
}
