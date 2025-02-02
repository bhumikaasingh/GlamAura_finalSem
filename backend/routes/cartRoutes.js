const router = require('express').Router();
const cartController = require('../controllers/cartController');


// Create cart API
router.post('/create', cartController.createCart);
router.get('/:id', cartController.getAllCarts);
router.put('/update_cart/:id', cartController.updateCart);

module.exports = router;