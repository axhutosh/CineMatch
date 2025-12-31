// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Navbar, Container, Form, Button, FormControl, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaTh, FaStream } from 'react-icons/fa';
import { MdMovie } from 'react-icons/md';

const AppNavbar = ({ viewMode, onViewSwitch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery('');
    }
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      variant="dark"
      style={{
        // ⚡️ THE FIX: Gradient Background (Black -> Transparent)
        // This makes the body content 'disappear' as it scrolls behind the navbar
        background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0) 100%)', 
        
        borderBottom: 'none',
        paddingTop: '15px',
        paddingBottom: '30px', // Increased bottom padding slightly to make the fade smoother
        zIndex: 1050,
        transition: 'background 0.3s ease'
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-danger">
          <MdMovie style={{ marginBottom: '4px' }} />
          {' '}CineMatch
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          
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
                  background: 'rgba(255,255,255,0.1)', // Slightly more visible on the gradient
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '20px',
                  paddingLeft: '15px'
                }}
              />
              <Button variant="outline-danger" type="submit" className="rounded-circle">
                <FaSearch />
              </Button>
            </Form>

            {/* View Switcher */}
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