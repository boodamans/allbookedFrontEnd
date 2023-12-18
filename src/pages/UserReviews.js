import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import allbookedApi from '../api/allbookedApi';
import GoogleBooksApi from '../api/googleBooksApi';
import UserContext from '../context/UserContext';
import coverUnavailable from './bookCover.jpeg';
import './styles/UserReviews.css';

const UserReviews = ({ username }) => {
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
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
    <div className="user-reviews-container">
      {userReviews.map((review) => (
        <div key={review.review_id} className="user-review-card">
          <Link to={`/book/${review.google_books_api_id}`}>
            <img
              src={review.bookDetails?.volumeInfo?.imageLinks?.thumbnail || coverUnavailable}
              alt="Book Thumbnail"
              className="user-review-thumbnail"
            />
          </Link>
          <p className="user-review-title">{review.bookDetails?.volumeInfo?.title}</p>
          <p className="user-review-rating">Rating: {review.rating}/10</p>
          <p className="user-review-text">{review.review_text}</p>
          {isCurrentUser && (
            <>
              <Link to={`/editreview/${review.review_id}`}>
                <button className="edit-review-button">Edit Review</button>
              </Link>
              <button
                onClick={() => handleDeleteReview(review.review_id)}
                className="delete-review-button"
              >
                Delete Review
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserReviews;
