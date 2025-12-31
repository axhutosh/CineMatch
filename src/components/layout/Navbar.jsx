// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaTh, FaFilm } from 'react-icons/fa'; 

const AppNavbar = ({ viewMode, onViewSwitch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const isHome = location.pathname === '/';

  return (
    <>
      {/* Custom CSS for Red Hover Effect */}
      <style>
        {`
          .nav-link-custom {
            color: rgba(255, 255, 255, 0.55) !important;
            transition: color 0.3s ease;
          }
          .nav-link-custom:hover, .nav-link-custom.active {
            color: #dc3545 !important; /* RED Color on Hover */
          }
          .nav-link-home {
            color: #fff !important;
          }
          .nav-link-home:hover {
            color: #dc3545 !important;
          }
        `}
      </style>

      <Navbar 
        expand="lg" 
        variant="dark" 
        fixed="top"
        style={{ 
          transition: 'padding 0.3s ease', 
          // ⚡️ UPDATED PADDING: Reduced values to move navbar UP
          padding: scrolled ? '5px 0' : '10px 0',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)'
        }}
      >
        <Container fluid className="px-4">
          
          {/* CUSTOM "BOW TIE" LOGO STYLE */}
          <Navbar.Brand 
            as={Link} 
            to="/" 
            className="d-flex align-items-center" 
            style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: '900', letterSpacing: '-1px' }}
          >
            {/* CINE (Red) - Shrinking Down */}
            <span className="text-danger fs-1">C</span>
            <span className="text-danger fs-3">I</span>
            <span className="text-danger fs-5">N</span>
            <span className="text-danger fs-6">E</span>

            {/* MATCH (White) - Growing Up */}
            <span className="text-white fs-6">M</span>
            <span className="text-white fs-6">A</span>
            <span className="text-white fs-5">T</span>
            <span className="text-white fs-3">C</span>
            <span className="text-white fs-1">H</span>
            
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto ms-3 gap-3 pt-2">
              <Nav.Link as={Link} to="/" className="nav-link-home fw-semibold">Home</Nav.Link>
              <Nav.Link as={Link} to="/movies" className="nav-link-custom">Movies</Nav.Link>
              <Nav.Link as={Link} to="/tv" className="nav-link-custom">TV Shows</Nav.Link>
              <Nav.Link as={Link} to="/anime" className="nav-link-custom">Anime</Nav.Link>
              <Nav.Link as={Link} to="/favorites" className="nav-link-custom">My List</Nav.Link>
            </Nav>

            <Nav className="d-flex align-items-center gap-3 pt-2">
              
              {/* View Switcher Icons */}
              {isHome && (
                <div className="d-none d-md-flex align-items-center gap-2 me-3">
                  <Button 
                    variant={viewMode === 'infinite' ? 'danger' : 'outline-secondary'}
                    size="sm"
                    className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                    style={{ width: '35px', height: '35px', border: 'none' }}
                    onClick={() => onViewSwitch('infinite')}
                    title="Infinite Wall"
                  >
                    <FaTh size={16} />
                  </Button>
                  <Button 
                    variant={viewMode === 'classic' ? 'danger' : 'outline-secondary'}
                    size="sm"
                    className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                    style={{ width: '35px', height: '35px', border: 'none' }}
                    onClick={() => onViewSwitch('classic')}
                    title="Classic View"
                  >
                    <FaFilm size={16} />
                  </Button>
                </div>
              )}

              {/* Search Bar */}
              <Form className="d-flex position-relative" onSubmit={handleSearch}>
                <FormControl
                  type="search"
                  placeholder="Titles, people, genres..."
                  className="bg-dark text-white border-0 rounded-pill ps-4 pe-5"
                  style={{ width: '250px', opacity: 0.8 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  variant="link" 
                  type="submit" 
                  className="position-absolute end-0 top-50 translate-middle-y text-white-50 pe-3"
                >
                  <FaSearch />
                </Button>
              </Form>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;