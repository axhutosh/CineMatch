// src/components/MovieCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Card, Button } from 'react-bootstrap';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { addFavorite, removeFavorite, isFavorite } from '../utils/favorites';

const MovieCard = ({ movie }) => {
  const [isFav, setIsFav] = useState(movie ? isFavorite(movie.id) : false);
  const navigate = useNavigate();

  if (!movie) {
    return null;
  }

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFav) {
      removeFavorite(movie.id);
      setIsFav(false);
    } else {
      addFavorite(movie); 
      setIsFav(true);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  const displayRating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Col onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <Card className="h-100 shadow-sm">
        
        {/* Poster section */}
        <div className="position-relative">
          {movie.poster_path ? (
            <Card.Img
              variant="top"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
          ) : (
            <div className="no-image-placeholder">
              <span>{movie.title}</span>
            </div>
          )}
        </div>
        
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fs-6 fw-bold mb-2" style={{minHeight: '40px'}}>
            {movie.title}
          </Card.Title>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <Card.Text className="text-muted mb-0">
              <FaStar className="text-warning mb-1" />
              {' '} {displayRating}
            </Card.Text>

            {/* --- 💡 FIX 💡 --- */}
            {/* Added conditional 'is-favorite' class */}
            <Button
              className={`p-0 fs-4 favorite-button btn-no-style ${isFav ? 'is-favorite' : ''}`}
              onClick={handleFavoriteClick}
              aria-label="Add to favorites"
            >
              {isFav ? <FaHeart /> : <FaRegHeart />}
            </Button>
            {/* --- END OF FIX --- */}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default MovieCard;