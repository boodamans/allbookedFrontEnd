import React, { useState, useEffect, useContext } from 'react';
import {Link} from 'react-router-dom';
import allbookedApi from '../api/allbookedApi';
import UserContext from "../context/UserContext";

const Review = ({ google_books_api_id }) => {
  const [reviews, setReviews] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsData = await allbookedApi.getBookReviews(google_books_api_id);
        setReviews(reviewsData);
  
        // Fetch like counts for each review
        const likeCountsData = await Promise.all(
          reviewsData.map((review) =>
            allbookedApi.getReviewLikesCount(review.review_id)
          )
        );
  
        // Create a dictionary with review IDs as keys and their like counts as values
        const likeCountsDict = Object.fromEntries(
          reviewsData.map((review, index) => [review.review_id, likeCountsData[index]])
        );
  
        setLikeCounts(likeCountsDict);
  
        // Check if currentUser is truthy before making requests that depend on it
        if (currentUser) {
          const likedReviewsData = await allbookedApi.getLikedReviews(currentUser.username);
          setLikedReviews(likedReviewsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [google_books_api_id, currentUser]);

  const isReviewLiked = (reviewId) => likedReviews.includes(reviewId);

  const handleLike = async (username, reviewId) => {
    try {
      const likeId = await allbookedApi.likeReview(username, reviewId);
      // Update the reviews array with the new likeId
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.review_id === reviewId ? { ...review, like_id: likeId } : review
        )
      );
      // Update the likedReviews array
      setLikedReviews((prevLikedReviews) => [...prevLikedReviews, reviewId]);

      // Increment the like count for the review
      setLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        [reviewId]: (prevLikeCounts[reviewId] || 0) + 1,
      }));
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
      // Update the likedReviews array
      setLikedReviews((prevLikedReviews) =>
        prevLikedReviews.filter((likedReview) => likedReview !== reviewId)
      );

      // Decrement the like count for the review
      setLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        [reviewId]: Math.max((prevLikeCounts[reviewId] || 0) - 1, 0),
      }));
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
          <p>User: <Link to={`/profile/${review.user_id}`}>{review.user_id}</Link></p>
          <p>Rating: {review.rating}/10</p>
          <p>{review.review_text}</p>
          {currentUser && (
            <>
              {isReviewLiked(review.review_id) ? (
                <button onClick={() => handleUnlike(currentUser.username, review.review_id)}>Unlike</button>
              ) : (
                <button onClick={() => handleLike(currentUser.username, review.review_id)}>Like</button>
              )}
            </>
          )}
          <p>Likes: {likeCounts[review.review_id]}</p>
        </div>
      ))}
    </div>
  );
};

export default Review;
