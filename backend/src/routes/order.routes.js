const express = require('express');
const router = express.Router();
const orderController = require('../controllers/Order.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', orderController.createOrder);
router.post('/admin', authenticate, orderController.createOrder);
router.get('/',authenticate, orderController.getAllOrders);
router.get('/:id',authenticate, orderController.getOrder);
router.put('/:id', authenticate, orderController.updateOrder);
router.delete('/:id', authenticate, orderController.deleteOrder);

module.exports = router;

