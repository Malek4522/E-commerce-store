import { createCookieSessionStorage } from '@remix-run/node';
import { OauthData, Tokens } from '@wix/sdk';
import {
    createWixClient,
    getWixClientId,
    initializeEcomApiAnonymous,
    initializeEcomApiWithTokens,
} from './api';

export type SessionData = {
    wixSessionTokens: Tokens;
    wixClientId: string;
};

type FlashData = {
    oAuthData: OauthData;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<
    SessionData,
    FlashData
>({
    cookie: {
        name: '__session',
        maxAge: 3600 * 24 * 100, // 100 days
        secure: true,
        httpOnly: true,
        sameSite: 'lax',

        secrets: [process.env.SESSION_COOKIE_SIGNING_SECRET ?? 's3cret1'],
    },
});

export { commitSession, destroySession, getSession };

export async function initializeEcomSession(request: Request) {
    const session = await getSession(request.headers.get('Cookie'));
    const sessionWixClientId = session.get('wixClientId');
    const wixClientId = getWixClientId();

    // Retrieve session tokens only if the OAuth client ID matches the one associated with the session;
    // otherwise, reset the session tokens due to client ID mismatch.
    const wixSessionTokens =
        sessionWixClientId === wixClientId ? session.get('wixSessionTokens') : undefined;

    const validTokens = await getValidAuthTokens(wixSessionTokens);

    let shouldUpdateSessionCookie = false;
    if (validTokens !== wixSessionTokens) {
        shouldUpdateSessionCookie = true;
        session.set('wixSessionTokens', validTokens);
    }

    if (sessionWixClientId !== wixClientId) {
        shouldUpdateSessionCookie = true;
        session.set('wixClientId', wixClientId);
    }

    return { wixSessionTokens: validTokens, session, shouldUpdateSessionCookie };
}

export async function initializeEcomApiForRequest(request: Request) {
    const { wixSessionTokens } = await initializeEcomSession(request);
    return wixSessionTokens
        ? initializeEcomApiWithTokens(wixSessionTokens)
        : initializeEcomApiAnonymous();
}

// renew token in one hour before expiration. the token lifetime is 4 hours
const TOKEN_REFRESH_MARGIN_SECONDS = 60 * 60;

async function getValidAuthTokens(sessionTokens: Tokens | undefined): Promise<Tokens> {
    const client = createWixClient(sessionTokens);

    if (sessionTokens === undefined) {
        return await client.auth.generateVisitorTokens();
    }

    const currentTimeStampSeconds = Date.now() / 1000;
    if (
        currentTimeStampSeconds >
        sessionTokens.accessToken.expiresAt - TOKEN_REFRESH_MARGIN_SECONDS
    ) {
        try {
            return await client.auth.renewToken(sessionTokens.refreshToken);
        } catch {
            return await client.auth.generateVisitorTokens();
        }
    }

    return sessionTokens;
}
