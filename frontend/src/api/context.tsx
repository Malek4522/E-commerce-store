import { createContext, useContext, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { CustomEcomApi, createCustomEcomApi } from './adapter';

const CustomEcomApiContext = createContext<CustomEcomApi | null>(null);

export function useEcomApi() {
    const api = useContext(CustomEcomApiContext);
    if (!api) throw new Error('useEcomApi must be used within CustomEcomApiProvider');
    return api;
}

interface Props {
    children: ReactNode;
    baseUrl?: string;
}

export function CustomEcomApiProvider({ children, baseUrl }: Props) {
    const api = createCustomEcomApi(baseUrl);

    return (
        <SWRConfig value={{ provider: () => new Map() }}>
            <CustomEcomApiContext.Provider value={api}>{children}</CustomEcomApiContext.Provider>
        </SWRConfig>
    );
} 