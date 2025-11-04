import React, { useState } from 'react';

// 1. Accept the onSearch prop
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      // 2. Instead of console.log, call the onSearch prop
      onSearch(query);
      // setQuery(''); // Optional: clear the input after search
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        className="search-input"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;