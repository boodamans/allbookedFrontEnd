import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import allbookedApi from '../api/allbookedApi';
import GoogleBooksApi from '../api/googleBooksApi';
import UserContext from '../context/UserContext';

const UserReviews = ({ username }) => {
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const {currentUser} = useContext(UserContext)
  const isCurrentUser = currentUser.username === username;


  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const userReviewsData = await allbookedApi.getUserReviews(username);
        setUserReviews(userReviewsData);
        const bookDetailsPromises = userReviewsData.map(async (review) => {
            const bookDetails = await GoogleBooksApi.getBook(review.google_books_api_id);
            return { ...review, bookDetails };
          });
        const reviewsWithBookDetails = await Promise.all(bookDetailsPromises);
        setUserReviews(reviewsWithBookDetails);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserReviews();
  }, [username]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await allbookedApi.deleteReview(reviewId);
      // Refresh the page after deletion
      window.location.reload();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) {
    return <p>Loading user reviews...</p>;
  }

  if (!userReviews || userReviews.length === 0) {
    return <p>No reviews available for this user.</p>;
  }

  return (
    <div>
      {userReviews.map((review) => (
        <div key={review.review_id}>
          <Link to={`/book/${review.google_books_api_id}`}>
            <img
              src={review.bookDetails?.volumeInfo?.imageLinks?.thumbnail || 'placeholder_thumbnail_url'}
              alt="Book Thumbnail"
              />
          </Link>
          <p>Book Title: {review.bookDetails?.volumeInfo?.title}</p>
          <p>Rating: {review.rating}/10</p>
          <p>{review.review_text}</p>
          <p>Created at: {review.created_at}</p>
          {isCurrentUser && (
            <>
              <Link to={`/editreview/${review.review_id}`}>
                <button>Edit Review</button>
              </Link>
              <button onClick={() => handleDeleteReview(review.review_id)}>Delete Review</button>
            </>
          )}        
        </div>
      ))}
    </div>
  );
};

export default UserReviews;
