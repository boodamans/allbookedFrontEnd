import React, { useState, useEffect } from 'react';
import allbookedApi from '../api/allbookedApi';

const Review = ({ google_books_api_id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await allbookedApi.getBookReviews(google_books_api_id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [google_books_api_id]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (!reviews || reviews.length === 0) {
    return <p>No reviews available for this book.</p>;
  }

  return (
    <div>
      <h2>Reviews:</h2>
      {reviews.map((review) => (
        <div key={review.review_id}>
          <p>User: {review.user_id}</p>
          <p>Rating: {review.rating}</p>
          <p>{review.review_text}</p>
          <p>Created at: {review.created_at}</p>
        </div>
      ))}
    </div>
  );
};

export default Review;
