import { createContext, useContext, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { CustomApi, createCustomApi } from './adapter';

const ApiContext = createContext<CustomApi | null>(null);

export function useApi() {
    const api = useContext(ApiContext);
    if (!api) throw new Error('useApi must be used within ApiProvider');
    return api;
}

interface Props {
    children: ReactNode;
    baseUrl?: string;
}

export function ApiProvider({ children, baseUrl }: Props) {
    const api = createCustomApi(baseUrl);

    return (
        <SWRConfig value={{ provider: () => new Map() }}>
            <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
        </SWRConfig>
    );
} 