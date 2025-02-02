export async function getAuthToken(): Promise<string | null> {
    // Get the token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    return token;
}

export function setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', token);
    }
}

export function removeAuthToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
    }
} 