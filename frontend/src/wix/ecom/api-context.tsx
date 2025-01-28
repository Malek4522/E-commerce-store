import { Tokens } from '@wix/sdk';
import React, { FC, useMemo } from 'react';
import { SWRConfig } from 'swr';
import { initializeEcomApiAnonymous, initializeEcomApiWithTokens } from './api';
import { EcomApi } from './types';

export const EcomApiContext = React.createContext<EcomApi | null>(null);

export const useEcomApi = (): EcomApi => {
    const context = React.useContext(EcomApiContext);
    if (!context) {
        throw new Error('useEcomApi must be used within a EcomApiContextProvider');
    }
    return context;
};

export interface EcomApiContextProviderProps extends React.PropsWithChildren {
    tokens?: Tokens;
}

export const EcomApiContextProvider: FC<EcomApiContextProviderProps> = ({ tokens, children }) => {
    const api = useMemo(() => {
        return tokens ? initializeEcomApiWithTokens(tokens) : initializeEcomApiAnonymous();
    }, [tokens]);

    return (
        <SWRConfig
            value={{
                revalidateIfStale: false,
                revalidateOnFocus: true,
                revalidateOnReconnect: true,
                refreshInterval: 5 * 60_000, // 5 minutes
                keepPreviousData: true,
            }}
        >
            <EcomApiContext.Provider value={api}>{children}</EcomApiContext.Provider>
        </SWRConfig>
    );
};
