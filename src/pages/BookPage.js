import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import GoogleBooksApi from '../api/googleBooksApi';
import coverUnavailable from './bookCover.jpeg';
import ReviewForm from './ReviewForm';
import UserContext from "../context/UserContext.js";
import Review from './Review.js';

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
    <div>
      <img
        src={book.volumeInfo.imageLinks?.thumbnail || coverUnavailable}
        alt="Book Cover"
      />
      <p>{book.volumeInfo.title}</p>
      <p>Author: {book.volumeInfo.authors?.join(', ')}</p>
      <p>{book.volumeInfo.description}</p>

      {currentUser ? (
        <>
          <ReviewForm google_books_api_id={id} username={currentUser.username} />
        </>
      ) : (
          <p>Log in to leave a review!</p>
          )}
          <Review google_books_api_id={id} />
    </div>
  );
};

export default BookPage;
