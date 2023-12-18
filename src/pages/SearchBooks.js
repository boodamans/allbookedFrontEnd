import React, { useState } from 'react';
import GoogleBooksApi from '../api/googleBooksApi';
import coverUnavailable from './bookCover.jpeg';
import { Link } from 'react-router-dom';
import './styles/SearchBooks.css';

const SearchBooks = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const results = await GoogleBooksApi.searchBooks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book title or author"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {searchResults && (
        <div className="results-container">
          <h2>Search Results:</h2>
          {searchResults.length > 0 ? (
            <div className="results-container">
              {searchResults.map((book) => (
                <div key={book.id} className="book-container">
                  <Link to={`/book/${book.id}`} className="book-link">
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail || coverUnavailable}
                      alt="Book Cover"
                      className="book-cover"
                    />
                    <p className="book-title">{book.volumeInfo.title}</p>
                  </Link>
                  <p className="author-info">by {book.volumeInfo.authors?.join(', ')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p></p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBooks;
