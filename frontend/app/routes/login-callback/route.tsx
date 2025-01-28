import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { commitSession, getSession, initializeEcomApiForRequest } from '~/src/wix/ecom/session';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get('Cookie'));
    const storedOauthData = session.get('oAuthData');

    if (storedOauthData === undefined) {
        return redirect('/login');
    }

    const api = await initializeEcomApiForRequest(request);
    const wixClient = api.getWixClient();

    const returnedOAuthData = wixClient.auth.parseFromUrl(request.url, 'query');
    if (returnedOAuthData.error) {
        throw new Error(`Error: ${returnedOAuthData.errorDescription}`);
    }

    const memberTokens = await wixClient.auth.getMemberTokens(
        returnedOAuthData.code,
        returnedOAuthData.state,
        storedOauthData,
    );
    wixClient.auth.setTokens(memberTokens);

    session.set('wixSessionTokens', memberTokens);

    const redirectUrl = new URL(storedOauthData.originalUri || new URL(request.url).host);

    // Append a dummy query parameter to avoid preserving sensitive auth params (e.g., `code`, `state`)
    // Some hosts (e.g., Netlify) retain original query params on redirects, which could expose them in the URL
    redirectUrl.searchParams.append('login', 'success');

    return redirect(redirectUrl.toString(), {
        headers: {
            'Set-Cookie': await commitSession(session),
        },
    });
}
