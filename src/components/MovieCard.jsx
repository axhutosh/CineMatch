// src/components/MovieCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Card, Button } from 'react-bootstrap';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { addFavorite, removeFavorite, isFavorite } from '../utils/favorites';

// Accepts 'item' (movie/show data) and '...props' (for styling overrides like width)
const MovieCard = ({ item, ...props }) => {
  
  const [isFav, setIsFav] = useState(item ? isFavorite(item.id) : false);
  const navigate = useNavigate();

  if (!item) return null;

  const isMovie = !!item.title;
  const title = item.title || item.name; 
  const navigatePath = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFav) {
      removeFavorite(item.id);
      setIsFav(false);
    } else {
      const itemToSave = { ...item, media_type: isMovie ? 'movie' : 'tv' };
      addFavorite(itemToSave); 
      setIsFav(true);
    }
  };
  
  const handleCardClick = () => {
    navigate(navigatePath);
  };
  
  const displayRating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

  return (
    // Spread ...props here to allow parent components to set fixed widths
    <Col onClick={handleCardClick} style={{ cursor: 'pointer', ...props.style }} className={props.className}>
      <Card 
        className="h-100 shadow-sm border-0" 
        style={{ backgroundColor: '#000', color: 'white' }} // 💡 Pure Black Background
      >
        
        {/* Poster section */}
        <div className="position-relative" style={{ aspectRatio: '2/3', overflow: 'hidden', borderRadius: '4px 4px 0 0' }}>
          {item.poster_path ? (
            <Card.Img
              variant="top"
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="no-image-placeholder d-flex align-items-center justify-content-center h-100 bg-secondary text-white">
              <span className="small text-center px-2">{title}</span>
            </div>
          )}
        </div>
        
        {/* Compact Body */}
        <Card.Body className="d-flex flex-column p-2"> 
          {/* Title: Truncated to 1 line */}
          <Card.Title className="fs-6 fw-bold mb-1 text-truncate" title={title}>
            {title}
          </Card.Title>
          
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <Card.Text className="text-secondary small mb-0 fw-bold">
              <FaStar className="text-warning mb-1 me-1" />
              {displayRating}
            </Card.Text>

            <Button
              className={`p-0 fs-5 favorite-button btn-no-style ${isFav ? 'is-favorite' : ''}`}
              onClick={handleFavoriteClick}
              aria-label="Add to favorites"
              style={{ color: '#888' }}
            >
              {isFav ? <FaHeart className="text-danger" /> : <FaRegHeart />}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default MovieCard;