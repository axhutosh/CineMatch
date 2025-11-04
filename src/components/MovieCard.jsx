// src/components/MovieCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  return (
    // Link now wraps the Col and holds the key.
    // text-decoration-none removes the link underline.
    <Link to={`/movie/${movie.id}`} className="text-decoration-none">
      <Col>
        <Card className="h-100 shadow-sm">
          {/* --- IMAGE LOGIC --- */}
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
          {/* --- END OF IMAGE LOGIC --- */}
          
          <Card.Body className="d-flex flex-column">
            <Card.Title className="fs-6 fw-bold mb-2" style={{minHeight: '40px'}}>
              {movie.title}
            </Card.Title>
            <Card.Text className="text-muted mt-auto">
              <FaStar className="text-warning mb-1" />
              {' '} {movie.vote_average.toFixed(1)}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Link>
  );
};

export default MovieCard;