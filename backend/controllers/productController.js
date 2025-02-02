const path = require('path');
const productModel = require('../models/productModel');
const fs = require('fs');

const createProduct = async (req, res) => {
    const { productName, productPrice, productDescription, productCategory } = req.body;

    if (!productName || !productPrice || !productDescription || !productCategory) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Check product image
    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            success: false,
            message: "Image not found!"
        });
    }

    const { productImage } = req.files;

    try {
        // Generate unique name for each file
        const imageName = `${Date.now()}-${productImage.name}`;
        const imageUploadPath = path.join(__dirname, '../public/products/', imageName);

        // Move file to the defined path
        await productImage.mv(imageUploadPath);

        // Save to database
        const newProduct = new productModel({
            productName,
            productPrice,
            productDescription,
            productCategory,
            productImage: imageName
        });

        const product = await newProduct.save();
        res.status(201).json({
            success: true,
            message: "Product created",
            data: product
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productModel.findById(id);
        res.status(200).json({
            success: true,
            message: "Product fetched",
            product
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const oldImagePath = path.join(__dirname, '../public/products/', existingProduct.productImage);

     
        fs.unlinkSync(oldImagePath);
        await productModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Product deleted"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        if (req.files && req.files.productImage) {
            const { productImage } = req.files;
            const imageName = `${Date.now()}-${productImage.name}`;
            const imageUploadPath = path.join(__dirname, '../public/products/', imageName);

            await productImage.mv(imageUploadPath);
            req.body.productImage = imageName;

            const existingProduct = await productModel.findById(req.params.id);
            if (existingProduct.productImage) {
                const oldImagePath = path.join(__dirname, '../public/products/', existingProduct.productImage);
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


const getProductsByIds = async (req, res) => {
    try {
      const productIds = req.body.ids;
      const products = await productModel.find({ _id: { $in: productIds } });
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        products
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  };

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    getProductsByIds

};