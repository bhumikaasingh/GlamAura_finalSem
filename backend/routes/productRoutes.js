const router = require('express').Router();
const productController = require('../controllers/productController');
const { authenticate } = require("../middleware/auth")
// Create product API
router.post('/create',authenticate, productController.createProduct);

// Fetch all products
router.get('/get_all_products', productController.getAllProducts);
router.get('/get_single_product/:id', productController.getProduct);
router.delete('/delete_product/:id',authenticate, productController.deleteProduct);
router.put('/update_product/:id',authenticate, productController.updateProduct);
router.post('/bulk', productController.getProductsByIds);



module.exports = router;

