import React, { useState } from 'react';
import allbookedApi from '../api/allbookedApi';

const ReviewForm = ({ google_books_api_id, username, onReviewSubmit }) => {
  const [rating, setRating] = useState(5); // Default rating to 5
  const [review_text, setReviewText] = useState('');

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value, 10));
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the postReview method from the API to submit the review
      const newReview = await allbookedApi.postReview(username, {
        google_books_api_id,
        rating,
        review_text,
      });

      // Callback to notify parent component about the new review
      if (onReviewSubmit) {
        onReviewSubmit(newReview);
      }

      // Clear the form fields after submission
      setRating(5);
      setReviewText('');
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error as needed
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <select value={rating} onChange={handleRatingChange}>
          {/* Generate options for ratings 1 to 10 */}
          {[...Array(10).keys()].map((value) => (
            <option key={value + 1} value={value + 1}>
              {value + 1}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Review:
        <textarea
          value={review_text}
          onChange={handleReviewTextChange}
          placeholder="Write your review here"
        />
      </label>
      <br />

      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
