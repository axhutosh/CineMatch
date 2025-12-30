// src/components/layout/AppNavbar.jsx
import React, { useState } from 'react';
import { Navbar, Container, Form, Button, FormControl, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaTh, FaStream } from 'react-icons/fa';
import { MdMovie } from 'react-icons/md';

const AppNavbar = ({ viewMode, onViewSwitch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // ⚡️ FIX 1: Search now navigates DIRECTLY. No waiting for parent props.
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`); // Forces url change to search results
      setQuery('');
    }
  };

  return (
    <Navbar 
      expand="lg" 
      className="mb-4" 
      sticky="top"
      variant="dark"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)', 
        backdropFilter: 'blur(12px)',           
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'background 0.3s ease'
      }}
    >
      <Container>
        {/* ⚡️ FIX 2: Removed 'preventDefault'. Now clicking this actually goes Home. */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-danger">
          <MdMovie style={{ marginBottom: '4px' }} />
          {' '}CineMatch
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* ⚡️ FIX 3: Simplified Links. Removed complex click handlers. */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/tv">TV Shows</Nav.Link>
            <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
            <Nav.Link as={Link} to="/favorites">My List</Nav.Link>
            <Nav.Link as={Link} to="/anime">Anime</Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center gap-3">
            
            {/* Search Form */}
            <Form className="d-flex" onSubmit={handleSearch}>
              <FormControl
                type="search"
                placeholder="Search..."
                className="me-2"
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff'
                }}
              />
              <Button variant="outline-danger" type="submit">
                <FaSearch />
              </Button>
            </Form>

            {/* Toggle Button */}
            <div 
              className="d-flex align-items-center p-1"
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <button
                onClick={() => onViewSwitch('infinite')}
                style={{
                  background: viewMode === 'infinite' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: viewMode === 'infinite' ? '#fff' : '#aaa',
                  border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                title="Infinite Wall"
              >
                <FaTh size={14} />
              </button>

              <button
                onClick={() => onViewSwitch('classic')}
                style={{
                  background: viewMode === 'classic' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: viewMode === 'classic' ? '#fff' : '#aaa',
                  border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                title="Classic View"
              >
                <FaStream size={14} />
              </button>
            </div>

          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;