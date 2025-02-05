const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    try {
        // Check for token in cookies first
        let token = req.cookies.accessToken;
        
        // If no token in cookies, check Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "manager"){
            return res.status(401).json({ message: 'Unauthorized' });
        }
               
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    authenticate
};