const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', productController.getProducts);
router.get('/all-products', productController.getProducts);
router.get('/rope', productController.getRopeProducts);
router.get('/jumpsuit', productController.getJumpsuitProducts);
router.get('/jupe', productController.getJupeProducts);
router.get('/new', productController.getNewProducts);
router.get('/sale', productController.getSaleProducts);
router.get('/admin', authenticate, productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);
router.patch('/:id/set-new', authenticate, productController.setProductNew);


module.exports = router;
