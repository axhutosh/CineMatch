// src/components/layout/Footer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';

const tmdbLogo = 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // 1. REMOVED bg="dark" and text-white
    <footer className="footer mt-auto py-1">
      <Container className="text-center">
        
        <div className="d-flex justify-content-center align-items-center mb-1">
          <div className="footer-name">
            Your Name Here
          </div>
          <span className="mx-3" style={{ fontSize: '1.2rem', color: '#aaa' }}>x</span>
          <img 
            src={tmdbLogo} 
            alt="TMDB Logo" 
            style={{ width: '60px' }}
          />
        </div>
        
        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
          &copy; CineMatch {currentYear}
        </div>
        
        {/* --- TMDB ATTRIBUTION TEXT REMOVED --- */}
        
      </Container>
    </footer>
  );
};

export default Footer;