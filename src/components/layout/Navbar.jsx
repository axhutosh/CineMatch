// src/components/layout/AppNavbar.jsx
import React, { useState } from 'react';
import { Navbar, Container, Form, Button, FormControl, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { FaSearch } from 'react-icons/fa';
import { MdMovie } from 'react-icons/md';
// We no longer need useDebounce or searchMovies here, as search is on its own page
// import useDebounce from '../../hooks/useDebounce';
// import { searchMovies } from '../../services/tmdbApi';

const AppNavbar = ({ onSearch, onHomeClick }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate(); // 2. Get the navigate function

  // Handler for form submit (Enter or button click)
  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      onSearch(query); // Call the onSearch prop from App.jsx
      setQuery('');    // Clear the input
    }
  };

  // Handler for the brand click
  const handleBrandClick = (e) => {
    e.preventDefault();
    setQuery('');
    onHomeClick(); // Call the onHomeClick prop from App.jsx
  };

  // 3. Simple handler for nav links
  const handleNavClick = (path) => {
    navigate(path);
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
          
          {/* 4. UPDATED NAVBAR LINKS */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={handleBrandClick}>Home</Nav.Link>
            <Nav.Link as={Link} to="/tv" onClick={() => handleNavClick('/tv')}>TV Shows</Nav.Link>
            <Nav.Link as={Link} to="/movies" onClick={() => handleNavClick('/movies')}>Movies</Nav.Link>
            <Nav.Link as={Link} to="/favorites" onClick={() => handleNavClick('/favorites')}>My List</Nav.Link>
            <Nav.Link as={Link} to="/anime" onClick={() => handleNavClick('/anime')}>Anime</Nav.Link>
          </Nav>
          
          {/* 5. Search form is now simpler */}
          {/* It no longer needs suggestions or positioning wrappers */}
          <Form className="d-flex" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search..."
              className="me-2"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-success" type="submit">
              <FaSearch />
            </Button>
          </Form>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;