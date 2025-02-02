const Review = require('../models/reviewModel'); // Adjust the path as necessary
const User = require('../models/userModel');

// Add a review
const addReview = async (req, res) => {
  const { productId, userId, rating, reviewText } = req.body;

  try {
    const review = new Review({ productId, userId, rating, reviewText });
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews for a product
const getReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId }); // Populate user info if needed
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReview,
  getReviews
};
