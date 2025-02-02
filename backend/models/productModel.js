const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productCategory: {
    type: String,
    required: true
  },
  productDescription: {
    type: String,
    required: true,
    maxlength: 300
  },
  productImage: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
