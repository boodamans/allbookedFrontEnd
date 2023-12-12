import React, { useState } from 'react';
import GoogleBooksApi from '../api/googleBooksApi';
import coverUnavailable from './bookCover.jpeg'
import { Link } from 'react-router-dom';

const SearchBooks = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const results = await GoogleBooksApi.searchBooks(query);
      setSearchResults(results);
      console.log(searchResults)
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book title or author"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

            {searchResults && (
        <div>
            {searchResults.length > 0 ? (
            <div>
                <h2>Search Results:</h2>
                {searchResults.map((book) => (
                <div key={book.id}>
                  <Link to={`/book/${book.id}`}>
                    {book.volumeInfo.imageLinks?.thumbnail ? (
                      <img src={book.volumeInfo.imageLinks.thumbnail} alt="Book Cover" />
                    ) : (
                      <img src={coverUnavailable} alt="Book Cover" />
                    )}
                    <p>{book.volumeInfo.title}</p>
                  </Link>
                    <p>by {book.volumeInfo.authors?.join(', ')}</p>
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
