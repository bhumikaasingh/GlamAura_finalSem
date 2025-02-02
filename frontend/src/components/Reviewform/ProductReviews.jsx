import React, { useState, useEffect } from 'react';
import { fetchReviewsApi } from '../../api/Api'; // Update the path as necessary

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetchReviewsApi(productId);
        setReviews(response.data.reviews);
      } catch (error) {
        setError("Failed to fetch reviews");
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="bg-white p-4 mb-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-lg">{review.userId.username}</span>
              <span className="ml-2 text-yellow-500">★ {review.rating}</span>
            </div>
            <p className="text-gray-700">{review.reviewText}</p>
            <p className="text-gray-500 text-sm mt-2">Posted on {new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductReviews;
