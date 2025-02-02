const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', productController.getProducts);
router.get('/admin', authenticate, productController.getProducts);
router.get('/admin/:id', authenticate, productController.getProducts);
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);
router.patch('/:id/set-new', authenticate, productController.setProductNew);

module.exports = router;
