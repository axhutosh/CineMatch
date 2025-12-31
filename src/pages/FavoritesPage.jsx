// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';
import { getFavorites } from '../utils/favorites'; // Ensure this utility exists

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites on mount
  useEffect(() => {
    // 1. Force read from LocalStorage
    const storedFavs = getFavorites(); 
    // 2. Ensure it's an array and reverse it so newest added are first
    setFavorites(Array.isArray(storedFavs) ? storedFavs.reverse() : []);
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-white mb-4 fw-bold border-start border-4 border-danger ps-3">
        My List
      </h2>
      
      {favorites.length === 0 ? (
        <div className="text-center text-secondary mt-5">
          <h4>Your list is empty</h4>
          <p>Mark movies and TV shows as favorites to see them here.</p>
        </div>
      ) : (
        <Row>
          {favorites.map((item) => (
            <Col key={item.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
              {/* 3. Use the unified MovieCard */}
              <MovieCard item={item} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default FavoritesPage;