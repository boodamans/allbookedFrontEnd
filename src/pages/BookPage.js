import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import GoogleBooksApi from '../api/googleBooksApi';
import coverUnavailable from './bookCover.jpeg';
import ReviewForm from './ReviewForm';
import UserContext from "../context/UserContext.js";
import Review from './Review.js';
import './styles/BookPage.css';

const BookPage = ({ match }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); 
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await GoogleBooksApi.getBook(id);
        setBook(bookData);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!book) {
    return <p>Error loading book details</p>;
  }

  return (
    <div className="book-page-container">
      <img
        src={book.volumeInfo.imageLinks?.thumbnail || coverUnavailable}
        alt="Book Cover"
        className="book-cover"
      />
      <p className="book-title">{book.volumeInfo.title}</p>
      <p className="author-info">Author: {book.volumeInfo.authors?.join(', ')}</p>
      <p className="book-description">{book.volumeInfo.description}</p>

      {currentUser ? (
        <div className="review-form">
          <ReviewForm google_books_api_id={id} username={currentUser.username} />
        </div>
      ) : (
        <p className="login-message">Log in to leave a review!</p>
      )}

      <div className="reviews">
        <Review google_books_api_id={id} />
      </div>
    </div>
  );
};

export default BookPage;
