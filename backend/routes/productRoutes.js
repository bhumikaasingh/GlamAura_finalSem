const router = require('express').Router();
const productController = require('../controllers/productController');
const { adminGuard } = require('../middleware/authGuard');


// Create product API
router.post('/create', productController.createProduct, adminGuard);

// Fetch all products
router.get('/get_all_products', productController.getAllProducts);
router.get('/get_single_product/:id', productController.getProduct);
router.delete('/delete_product/:id', productController.deleteProduct, adminGuard);
router.put('/update_product/:id', productController.updateProduct, adminGuard);
router.post('/bulk', productController.getProductsByIds);



module.exports = router;

