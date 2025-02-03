const express = require('express');
const router = express.Router();

// Import route modules
const productRoutes = require('./Product.routes');
const orderRoutes = require('./order.routes');
const authRoutes = require('./auth.routes');

// Use route modules
router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/auth', authRoutes);

// Enhanced health check endpoint
router.get('/health', (req, res) => {
    const healthcheck = {
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        memoryUsage: process.memoryUsage(),
        version: process.version,
        services: {
            database: 'OK', // You might want to add actual DB connection check
            server: 'OK'
        }
    };
    
    try {
        res.status(200).json(healthcheck);
    } catch (error) {
        healthcheck.status = 'ERROR';
        healthcheck.message = error.message;
        res.status(503).json(healthcheck);
    }
});

module.exports = router;

