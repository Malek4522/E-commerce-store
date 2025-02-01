import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { useAuth } from '../api/auth-context';
import styles from './admin.login.module.scss';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(password);
        if (success) {
            navigate('/admin/products');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginBox}>
                <h1>Admin Login</h1>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.loginButton}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
} 