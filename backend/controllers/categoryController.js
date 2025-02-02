const path = require('path');
const fs = require('fs');
const categoryModel = require('../models/categoryModel');
const exp = require('constants');

const createCategory = async (req, res) => {
    const { name, details } = req.body;

    if (!name || !details) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (!req.files || !req.files.image) {
        return res.status(400).json({
            success: false,
            message: "Image not found!"
        });
    }

    const { image } = req.files;

    try {
        // Generate unique name for each file
        const imageName = `${Date.now()}-${image.name}`;
        const imageUploadPath = path.join(__dirname, '../public/categories/', imageName);

        // Move file to the defined path
        await image.mv(imageUploadPath);

        // Save to database
        const newCategory = new categoryModel({
            name,
            details,
            image: imageName
        });


        const category = await newCategory.save();
        res.status(201).json({
            success: true,
            message: "Category created",
            category
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

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            categories
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

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await categoryModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Category deleted",
            category
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

const getCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await categoryModel.findById(id);
        res.status(200).json({
            success: true,
            message: "Category fetched",
            category
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

const updateCategory = async (req, res) => {
    try {
        if (req.files || req.files.image) {
            const { image } = req.files;
            const imageName = `${Date.now()}-${image.name}`;
            const imageUploadPath = path.join(__dirname, '../public/categories/', imageName);

            await image.mv(imageUploadPath);
            req.body.image = imageName;

            const category = await categoryModel.findById(req.params.id);
            if(category.image){
                const oldImagePath = path.join(__dirname, '../public/categories/', category.image);
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Category updated",
            updatedCategory
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


module.exports = {  
    createCategory,
    getAllCategories,
    deleteCategory,
    getCategory,
    updateCategory
}