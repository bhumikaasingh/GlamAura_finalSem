const express = require('express');
const router = express.Router();
const {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getTotalOrders,
    getSingleOrder,
    deleteOrder
} = require('../controllers/orderController');

// Create a new order
router.post('/create', createOrder);
router.get('/:id', getAllOrders);

// Update payment status
router.put('/update_order/:id', updateOrderStatus);

// Update shipping status

router.get('/get_single_order/:id',getSingleOrder );

router.get('/', getTotalOrders);

router.delete('/:id', deleteOrder);





module.exports = router;
