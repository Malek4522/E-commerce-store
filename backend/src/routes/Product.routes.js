const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware').urlValidationMiddleware;

router.get('/', productController.getProducts);
router.post('/', authenticate, validate, productController.createProduct);
router.put('/:id', authenticate, validate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);
router.patch('/:id/set-new', authenticate, productController.setProductNew);

module.exports = router;
