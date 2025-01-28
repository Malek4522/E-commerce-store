import { useEffect, useMemo, useState } from 'react';
import { type Member, useEcomApi } from '../ecom';

export function useUserInfo() {
    const api = useEcomApi();

    const [user, setUser] = useState<Member>();

    const isLoggedIn = useMemo(() => api.isLoggedIn(), [api]);

    useEffect(() => {
        if (isLoggedIn) {
            api.getUser().then(setUser);
        }
    }, [api, isLoggedIn]);

    return { user, isLoggedIn };
}
