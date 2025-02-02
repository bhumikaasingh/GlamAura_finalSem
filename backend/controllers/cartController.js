const path = require('path');
const fs = require('fs');
const cartModel = require('../models/Cart');
const ProductModel = require('../models/productModel');



const createCart = async (req, res) => {
    const { userId, products } = req.body;
  
    try {
      const productIds = products.map(p => p.productId);
      const productDetails = await ProductModel.find({ _id: { $in: productIds } });
  
      const detailedProducts = products.map(p => {
        const product = productDetails.find(prod => prod._id.toString() === p.productId);
        return {
          productId: p.productId,
          quantity: p.quantity,
          name: product.name,
          image: product.image,
          price: product.price,
          description: product.description
        };
      });
  
      let cart = await cartModel.findOne({ userId });
  
      if (cart) {
        detailedProducts.forEach(newProduct => {
          const existingProductIndex = cart.products.findIndex(
            product => product.productId.toString() === newProduct.productId.toString()
          );
  
          if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += newProduct.quantity;
          } else {
            cart.products.push(newProduct);
          }
        });
      } else {
        cart = await cartModel.create({ userId, products: detailedProducts });
      }
  
      // Save the updated cart
      cart = await cart.save();
  
      res.status(201).json({
        success: true,
        message: "Cart created/updated",
        cart
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }

  const getAllCarts = async (req, res) => {
    try {
      const userId = req.params.id;
      const cart = await cartModel.findOne({ userId });
      if (cart) {
        res.status(200).json({
          success: true,
          message: 'Cart fetched successfully',
          cart
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  };

  const getAllOrders = async (req, res) => {
    const id = req.params.id;

    try {
      const orders = await Order.find(id ? { userId: id } : {});
      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        orders
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }

  const updateCart = async (req, res) => {
    const { userId, products } = req.body;
  
    // Validate request body
    if (!userId || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data'
      });
    }
  
    try {
      // Extract product IDs and fetch product details
      const productIds = products.map(p => p.productId);
      const productDetails = await ProductModel.find({ _id: { $in: productIds } });
  
      // Map products with detailed information
      const detailedProducts = products.map(p => {
        const product = productDetails.find(prod => prod._id.toString() === p.productId);
        return {
          productId: p.productId,
          quantity: p.quantity,
          name: product ? product.name : 'Unknown',
          image: product ? product.image : '',
          price: product ? product.price : 0,
          description: product ? product.description : 'No description'
        };
      });
  
      // Find or create cart
      let cart = await cartModel.findOne({ userId });
  
      if (cart) {
        // Filter out products with zero quantity
        cart.products = detailedProducts.filter(p => p.quantity > 0);
      } else {
        // Only include products with quantity greater than zero
        cart = await cartModel.create({
          userId,
          products: detailedProducts.filter(p => p.quantity > 0)
        });
      }
  
      // Save the updated cart
      cart = await cart.save();
  
      res.status(200).json({
        success: true,
        message: "Cart updated",
        cart
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
module.exports={
    createCart,
    getAllCarts,
    updateCart,
    getAllOrders
}