const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    try {
        console.log('[Auth Middleware] Starting authentication check');
        
        // Check for token in cookies first
        let token = req.cookies.accessToken;
        console.log('[Auth Middleware] Token from cookies:', token ? 'Present' : 'Not found');
        
        // If no token in cookies, check Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            console.log('[Auth Middleware] Authorization header:', authHeader);
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
                console.log('[Auth Middleware] Bearer token extracted from header');
            }
        }

        if (!token) {
            console.log('[Auth Middleware] No token found in either cookies or Authorization header');
            return res.status(401).json({ message: 'Authentication required' });
        }

        console.log('[Auth Middleware] Attempting to verify token');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('[Auth Middleware] Token verified successfully, decoded role:', decoded.role);

        if(decoded.role !== "manager"){
            console.log('[Auth Middleware] Unauthorized role:', decoded.role);
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        console.log('[Auth Middleware] Authentication successful');
        next();
    } catch (error) {
        console.error('[Auth Middleware] Error:', error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    authenticate
};