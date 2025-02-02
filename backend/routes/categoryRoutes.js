const router = require('express').Router();
const categoryController = require('../controllers/categoryController');

// Create category API
router.post('/create', categoryController.createCategory);
router.get('/get_all_categories', categoryController.getAllCategories);
router.delete('/delete_category/:id', categoryController.deleteCategory);
router.get('/get_single_category/:id', categoryController.getCategory);
router.put('/update_category/:id', categoryController.updateCategory);


module.exports = router;
