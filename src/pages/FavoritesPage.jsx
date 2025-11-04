// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { getFavorites } from '../utils/favorites';
import MovieCard from '../components/MovieCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage when the page mounts
    setFavorites(getFavorites());
  }, []);

  return (
    <Container className="mt-5 pb-5">
      <h1 className="my-4 text-center">My List</h1>

      {favorites.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          You haven't added any movies to your list yet.
        </Alert>
      )}
    </Container>
  );
};

export default FavoritesPage;