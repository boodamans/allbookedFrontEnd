import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GoogleBooksApi from '../api/googleBooksApi';
import coverUnavailable from './bookCover.jpeg';

const BookPage = ({ match }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Assuming you're using React Router and book ID is in the route params

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
      <p>Title: {book.volumeInfo.title}</p>
      <p>Author: {book.volumeInfo.authors?.join(', ')}</p>
      <p>Description: {book.volumeInfo.description}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default BookPage;
