import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { useAuth } from '../api/auth-context';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const {checkAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            const isValid = await checkAuth();
            if (!isValid) {
                navigate('/admin/login');
            }
        };
        verify();
    }, [checkAuth, navigate]);

    // Don't show a loading state, just render children
    // This works because we initialized isAuthenticated as true
    return <>{children}</>;
} 