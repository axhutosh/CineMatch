// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Navbar, Container, Form, Button, FormControl } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa'; // Search icon
import { MdMovie } from 'react-icons/md'; // Movie icon

const AppNavbar = ({ onSearch, onHomeClick }) => {
  const [query, setQuery] = useState('');

  // Handler to pass the search query up to App.jsx
  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      onSearch(query);
    }
  };

  // Handler to clear the search when clicking the brand
  const handleBrandClick = (e) => {
    e.preventDefault();
    setQuery(''); // Clear internal query state
    onHomeClick(); // Tell App.jsx to reset
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4" sticky="top">
      <Container>
        <Navbar.Brand href="/" onClick={handleBrandClick}>
          <MdMovie style={{ marginBottom: '4px' }} /> {/* Icon */}
          {' '}CineMatch
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex ms-auto" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search for a movie..."
              className="me-2"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-success" type="submit">
              <FaSearch /> {/* Icon */}
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// We rename the export to avoid conflict with react-bootstrap's 'Navbar'
export default AppNavbar;