const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController'); // Adjust the path as necessary
// Route to add a review
router.post('/create', addReview);

// Route to get reviews for a product
router.get('/:productId', getReviews);

module.exports = router;
