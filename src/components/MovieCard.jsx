// src/components/MovieCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Card, Button } from 'react-bootstrap';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { addFavorite, removeFavorite, isFavorite } from '../utils/favorites';

// 1. Rename 'movie' prop to 'item' to be more generic
const MovieCard = ({ item }) => {
  
  // 2. Add safety checks for the new 'item' prop
  const [isFav, setIsFav] = useState(item ? isFavorite(item.id) : false);
  const navigate = useNavigate();

  if (!item) {
    return null; // Don't render if the item is bad
  }

  // 3. Determine if it's a movie or TV show. Movies have 'title', TV shows have 'name'.
  const isMovie = !!item.title;
  const title = item.title || item.name; // Use whichever one exists
  const navigatePath = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`; // Set the correct path

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFav) {
      removeFavorite(item.id);
      setIsFav(false);
    } else {
      // Add a 'media_type' to the object before saving
      // This helps our Favorites page know where to link back to
      const itemToSave = {
        ...item,
        media_type: isMovie ? 'movie' : 'tv',
      };
      addFavorite(itemToSave); 
      setIsFav(true);
    }
  };
  
  const handleCardClick = () => {
    // 4. Navigate to the correct path
    navigate(navigatePath);
  };
  
  const displayRating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

  return (
    <Col onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <Card className="h-100 shadow-sm">
        
        {/* Poster section */}
        <div className="position-relative">
          {item.poster_path ? (
            <Card.Img
              variant="top"
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={title} // Use the generic title
            />
          ) : (
            <div className="no-image-placeholder">
              <span>{title}</span>
            </div>
          )}
        </div>
        
        <Card.Body className="d-flex flex-column">
          {/* 5. Display the generic title */}
          <Card.Title className="fs-6 fw-bold mb-2" style={{minHeight: '40px'}}>
            {title}
          </Card.Title>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <Card.Text className="text-muted mb-0">
              <FaStar className="text-warning mb-1" />
              {' '} {displayRating}
            </Card.Text>

            <Button
              className={`p-0 fs-4 favorite-button btn-no-style ${isFav ? 'is-favorite' : ''}`}
              onClick={handleFavoriteClick}
              aria-label="Add to favorites"
            >
              {isFav ? <FaHeart /> : <FaRegHeart />}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default MovieCard;