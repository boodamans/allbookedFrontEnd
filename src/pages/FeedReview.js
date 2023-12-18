import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import coverUnavailable from './bookCover.jpeg';

const FeedReview = ({ review }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDetails = await GoogleBooksApi.getBook(review.google_books_api_id);
        setBookDetails(bookDetails);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [review.google_books_api_id]);

  if (loading) {
    return <p>Loading book details...</p>;
  }

  return (
    <div>
      <Link to={`/book/${review.google_books_api_id}`}>
        <img
          src={bookDetails?.volumeInfo?.imageLinks?.thumbnail || coverUnavailable}
          alt="Book Thumbnail"
        />
      </Link>
      <p>Book Title: {bookDetails?.volumeInfo?.title}</p>
      <p>Reviewer: {review.username}</p>
      <p>Rating: {review.rating}/10</p>
      <p>Review: {review.review_text}</p>
    </div>
  );
};

export default FeedReview;
