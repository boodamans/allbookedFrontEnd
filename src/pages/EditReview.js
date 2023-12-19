import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import allbookedApi from '../api/allbookedApi';
import UserContext from '../context/UserContext';
import './styles/EditReview.css';

const EditReview = () => {
  const { currentUser } = useContext(UserContext);
  const { review_id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
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
      await allbookedApi.editReview(currentUser.username, review_id, {
        rating,
        review_text,
      });

      // Redirect to the review page after submission
      navigate(`/profile/${currentUser.username}`);
    } catch (error) {
      console.error('Error editing review:', error);
    }
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const existingReview = await allbookedApi.getReviewById(review_id);

        if (currentUser.username !== existingReview.user_id) {
          console.error('Unauthorized access to edit review');
          navigate('/');
        }

        setReview(existingReview);
        setRating(existingReview.rating);
        setReviewText(existingReview.review_text);
      } catch (error) {
        console.error('Error fetching review:', error);
        navigate('/');
      }
    };

    if (review_id) {
      fetchReview();
    }
  }, [review_id, currentUser.username, navigate]);

  return (
    <div className="edit-review-container">
      <h2>Edit Review</h2>
      {review && (
        <form onSubmit={handleSubmit} className="edit-review-form">
          <label>
            Rating:
            <select value={rating} onChange={handleRatingChange} className="edit-review-rating">
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
              className="edit-review-textarea"
            />
          </label>
          <br />

          <button type="submit" className="edit-review-submit-button">
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default EditReview;
