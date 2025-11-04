// src/components/layout/Footer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';

// This is the official SVG logo URL from the TMDB docs
const tmdbLogo = 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <Container className="d-flex justify-content-center align-items-center flex-wrap">
        <img 
          src={tmdbLogo} 
          alt="TMDB Logo" 
          style={{ width: '100px', marginRight: '20px' }} 
        />
        <span className="text-muted">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </Container>
    </footer>
  );
};

export default Footer;