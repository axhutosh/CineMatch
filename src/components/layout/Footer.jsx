// src/components/layout/Footer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';

const tmdbLogo = 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg';

// 1. Accept the 'isFixed' prop
const Footer = ({ isFixed }) => {
  const currentYear = new Date().getFullYear();

  return (
    // 2. Add the conditional class logic here
    <footer className={`footer mt-auto py-1 ${isFixed ? 'footer-fixed' : ''}`}>
      <Container className="text-center">
        
        <div className="d-flex justify-content-center align-items-center mb-1">
          <div className="footer-name">
            Ashutosh
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
        
      </Container>
    </footer>
  );
};

export default Footer;