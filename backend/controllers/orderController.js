const Order = require('../models/Order');
const Product = require('../models/productModel');
const cart = require('../models/Cart');

// Create a New Order

const getTotalOrders = async (req, res) => {
    try {

        // Fetch all orders without any parameters
        const orders = await Order.find(); // Ensure no parameters are passed here
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error); // Added logging for debugging
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
    }
};


const createOrder = async (req, res) => {
    const { userId, items, totalAmount } = req.body;
    console.log('Request Body:', req.body);

    try {
        // Validate totalAmount
        if (isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid total amount' });
        }

        // Validate items
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required and must be an array' });
        }

        const productIds = items.map(p => p.productId);
        const productDetails = await Product.find({ _id: { $in: productIds } });

        const detailedProducts = items.map(p => {
            const product = productDetails.find(prod => prod._id.toString() === p.productId);
            if (!product) {
                throw new Error(`Product not found: ${p.productId}`);
            }
            return {
                productId: p.productId,
                quantity: p.quantity,
                name: product.name,
                image: product.image,
                price: product.price,
                description: product.description
            };
        });

        // Create a new order
        const newOrder = new Order({
            userId,
            items: detailedProducts,
            totalAmount
        });

        const savedOrder = await newOrder.save();

        // Delete the cart after the order is created
        await cart.deleteOne({ userId });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: savedOrder
        });

    } catch (error) {
        console.log('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


const getSingleOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
    }
}



const getAllOrders = async (req, res) => {
    const userId = req.params.id;

    try {
        // Ensure userId is provided
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Find orders for the specific user
        const orders = await Order.find({ userId });
        
        // Check if orders exist
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found for this user'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            orders
        });
    } catch (error) {
        console.log('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update Payment Status
const updateOrderStatus = async (req, res) => {
    const { orderId, status, tracking } = req.body;


    try {

        console.log('Update Request:', req.body);
        // Find the order by its ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update the status and tracking fields
        if (status) {
            order.status = status;
        }
        if (tracking) {
            order.tracking = tracking;
        }

        // Save the updated order
        const updatedOrder = await order.save();
        res.status(200).json({ success: true, message: 'Order status and tracking updated', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update order status and tracking', error: error.message });
    }
};


const deleteOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        console.log('Deleting Order ID:', orderId); // Log the ID being used for deletion

        // Find the order by its ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Delete the order
        await Order.deleteOne({ _id: orderId });
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Failed to delete order', error: error.message });
    }
};


module.exports = {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getSingleOrder,
    getTotalOrders,
    deleteOrder
};
