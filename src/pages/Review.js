import React, { useState, useEffect, useContext } from 'react';
import allbookedApi from '../api/allbookedApi';
import UserContext from "../context/UserContext";

const Review = ({ google_books_api_id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

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

  const handleLike = async (username, reviewId) => {
    try {
      const likeId = await allbookedApi.likeReview(username, reviewId);
      // Update the reviews array with the new likeId
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.review_id === reviewId ? { ...review, like_id: likeId } : review
        )
      );
    } catch (error) {
      console.error('Error liking review:', error);
      // Handle error as needed
    }
  };

  const handleUnlike = async (username, reviewId) => {
    try {
      await allbookedApi.unlikeReview(username, reviewId);
      // Update the reviews array to remove the like_id
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.review_id === reviewId ? { ...review, like_id: null } : review
        )
      );
    } catch (error) {
      console.error('Error unliking review:', error);
      // Handle error as needed
    }
  };

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
          <p>Rating: {review.rating}/10</p>
          <p>{review.review_text}</p>
          <p>Created at: {review.created_at}</p>
          {currentUser && (
            <>
              {review.like_id ? (
                <button onClick={() => handleUnlike(currentUser.username, review.review_id)}>Unlike</button>
              ) : (
                <button onClick={() => handleLike(currentUser.username, review.review_id)}>Like</button>
              )}
            </>
          )}
          
        </div>
      ))}
    </div>
  );
};

export default Review;
