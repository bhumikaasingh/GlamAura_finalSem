import React, { useState } from 'react';
import { addReviewApi } from '../../api/Api'; // Update the path as necessary

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = JSON.parse(localStorage.getItem('user'))._id;
      await addReviewApi({ productId, userId, rating, reviewText });
      setRating(1); // Reset rating
      setReviewText(''); // Reset review text
    } catch (error) {
      setError("Failed to submit review");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm max-w-md mx-auto">
      <h2 className="text-xl font-medium mb-3">Write a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium">Rating:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 mt-1 block w-full"
          >
            {[1, 2, 3, 4, 5].map((rate) => (
              <option key={rate} value={rate}>{rate}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium">Review:</label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="3"
            className="border border-gray-300 rounded-md p-2 mt-1 block w-full resize-none"
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Submit
        </button>
      </form>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default ReviewForm;
