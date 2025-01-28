import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { destroySession, getSession, initializeEcomApiForRequest } from '~/src/wix/ecom/session';

export async function loader({ request }: LoaderFunctionArgs) {
    const api = await initializeEcomApiForRequest(request);

    const currentUrl = new URL(request.url);
    let logoutUrl: string | undefined;
    try {
        const logoutInfo = await api.logout(currentUrl.origin);
        logoutUrl = logoutInfo.logoutUrl;
    } catch {
        // ignore logout error. it happens for instance in case if logged in user reset his password
    }

    const session = await getSession(request.headers.get('Cookie'));
    return redirect(logoutUrl ?? '/', {
        headers: {
            'Set-Cookie': await destroySession(session),
        },
    });
}
