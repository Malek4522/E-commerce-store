import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from '@remix-run/react';

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
const TOKEN_KEY = 'admin_token'; // Key for localStorage token

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { 'Authorization': `Bearer ${token}` } : { 'Authorization': '' };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith('/admin');

    const checkAuth = useCallback(async () => {
        // Only check auth for admin routes
        if (!isAdminRoute) {
            return true;
        }

        const now = Date.now();
        
        // Return cached result if it's recent enough
        if (now - authCache.lastCheck < AUTH_CHECK_INTERVAL) {
            setIsAuthenticated(authCache.status);
            return authCache.status;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product/admin`, {
                credentials: 'include',
                headers: getAuthHeaders()
            });
            const isValid = response.status !== 401;
            
            // Update cache
            authCache = {
                status: isValid,
                lastCheck: now
            };
            
            setIsAuthenticated(isValid);
            return isValid;
        } catch {
            return isAuthenticated;
        }
    }, [isAuthenticated, isAdminRoute]);

    // Check authentication status on mount and when route changes
    useEffect(() => {
        if (isAdminRoute) {
            checkAuth();
        }
    }, [checkAuth, isAdminRoute]);

    const login = async (password: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password }),
            });

            const success = response.ok;
            if (success) {
                // Store token from response if available
                const data = await response.json();
                if (data.accessToken) {
                    localStorage.setItem(TOKEN_KEY, data.accessToken);
                }
                
                authCache = {
                    status: true,
                    lastCheck: Date.now()
                };
            }
            setIsAuthenticated(success);
            return success;
        } catch {
            setIsAuthenticated(false);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY); // Clear stored token
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
            // Add auth headers to all requests
            if (typeof args[1] === 'object') {
                args[1] = {
                    ...args[1],
                    headers: {
                        ...(args[1]?.headers || {}),
                        ...getAuthHeaders()
                    }
                };
            }
            
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