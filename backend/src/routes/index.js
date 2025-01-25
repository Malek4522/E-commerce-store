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


// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
module.exports = router;

