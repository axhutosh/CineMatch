// src/components/layout/AppNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Form, Button, FormControl, ListGroup, Nav } from 'react-bootstrap'; // 1. Import Nav
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { MdMovie } from 'react-icons/md';
import useDebounce from '../../hooks/useDebounce';
import { searchMovies } from '../../services/tmdbApi';

const AppNavbar = ({ onSearch, onHomeClick }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); 
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery) {
        try {
          const response = await searchMovies(debouncedQuery, 1);
          const data = response.data.body ? JSON.parse(response.data.body) : response.data;
          setSuggestions(data.results || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Failed to fetch suggestions", err);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      onSearch(query);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (movieTitle) => {
    setQuery(movieTitle);
    onSearch(movieTitle);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onHomeClick();
  };
  
  // 2. Helper to clear suggestions when navigating
  const handleNavClick = () => {
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <Navbar expand="lg" className="mb-4" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleBrandClick}>
          <MdMovie style={{ marginBottom: '4px' }} />
          {' '}CineMatch
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* 3. ADD NAVBAR LINKS */}
          <Nav className="me-auto" onSelect={handleNavClick}>
            <Nav.Link as={Link} to="/" onClick={handleBrandClick}>Home</Nav.Link>
            <Nav.Link as={Link} to="/favorites">My List</Nav.Link>
            {/* We can add "TV Shows" and "Anime" here later */}
          </Nav>

          <div className="position-relative">
            <Form className="d-flex" onSubmit={handleSearch}>
              <FormControl
                type="search"
                placeholder="Search for a movie..."
                className="me-2"
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setShowSuggestions(true)}
              />
              <Button variant="outline-success" type="submit">
                <FaSearch />
              </Button>
            </Form>

            {showSuggestions && suggestions.length > 0 && (
              <ListGroup className="search-suggestions">
                {suggestions.slice(0, 5).map((movie) => (
                  <ListGroup.Item 
                    key={movie.id} 
                    action
                    onClick={() => handleSuggestionClick(movie.title)}
                  >
                    {movie.title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;