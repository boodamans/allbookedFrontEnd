import React, { useState } from 'react';
import allbookedApi from '../api/allbookedApi';
import './styles/ReviewForm.css';

const ReviewForm = ({ google_books_api_id, username, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
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
      const newReview = await allbookedApi.postReview(username, {
        google_books_api_id,
        rating,
        review_text,
      });

      if (onReviewSubmit) {
        onReviewSubmit(newReview);
      }

      setRating(5);
      setReviewText('');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form className="review-form-container" onSubmit={handleSubmit}>
      <div className="review-label-container">
        <label>
          Rating:
          <select className="review-select" value={rating} onChange={handleRatingChange}>
            {[...Array(10).keys()].map((value) => (
              <option key={value + 1} value={value + 1}>
                {value + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Review:
          <textarea
            className="review-textarea"
            value={review_text}
            onChange={handleReviewTextChange}
            placeholder="Write your review here"
          />
        </label>
      </div>
      <button className="review-button" type="submit">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
