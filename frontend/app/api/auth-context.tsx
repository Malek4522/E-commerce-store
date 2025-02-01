import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@remix-run/react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Cache the auth status and last check time
let authCache = {
    status: true,
    lastCheck: 0
};

const AUTH_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes
const AUTH_CHECK_DEBOUNCE = 2000; // 2 seconds debounce

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const navigate = useNavigate();

    const checkAuth = useCallback(async () => {
        const now = Date.now();
        
        // Return cached result if it's recent enough
        if (now - authCache.lastCheck < AUTH_CHECK_INTERVAL) {
            setIsAuthenticated(authCache.status);
            return authCache.status;
        }

        try {
            const response = await fetch('http://localhost:5000/api/product/admin', {
                credentials: 'include'
            });
            
            const isValid = response.status !== 401;
            
            // Update cache
            authCache = {
                status: isValid,
                lastCheck: now
            };
            
            setIsAuthenticated(isValid);
            return isValid;
        } catch (error) {
            return isAuthenticated;
        }
    }, [isAuthenticated]);

    // Check authentication status on mount only
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (password: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password }),
            });

            const success = response.ok;
            if (success) {
                authCache = {
                    status: true,
                    lastCheck: Date.now()
                };
            }
            setIsAuthenticated(success);
            return success;
        } catch (error) {
            setIsAuthenticated(false);
            return false;
        }
    };

    const logout = () => {
        authCache = {
            status: false,
            lastCheck: Date.now()
        };
        setIsAuthenticated(false);
        navigate('/admin/login');
    };

    // Global error handler for 401 responses
    useEffect(() => {
        let lastAuthCheck = 0;

        const handleFetchResponse = async (response: Response) => {
            if (response.status === 401) {
                const now = Date.now();
                if (now - lastAuthCheck > AUTH_CHECK_DEBOUNCE) {
                    lastAuthCheck = now;
                    const isValid = await checkAuth();
                    if (!isValid) {
                        navigate('/admin/login');
                    }
                }
            }
        };

        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            await handleFetchResponse(response.clone());
            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [navigate, checkAuth]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 