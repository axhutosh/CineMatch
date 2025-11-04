// src/pages/MovieDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getRecommendedMovies } from '../services/tmdbApi';
import { Container, Row, Col, Image, Spinner, Alert, Badge, Button } from 'react-bootstrap'; 
import { FaStar, FaClock, FaPlayCircle } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';
import YouTube from 'react-youtube'; // 1. Import the new player

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  
  // 2. We only need the video *key* now, not the full URL
  const [trailerKey, setTrailerKey] = useState(null); 
  const [showPlayer, setShowPlayer] = useState(false); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setTrailerKey(null);
        setShowPlayer(false);
        
        const [detailsResponse, recommendResponse] = await Promise.all([
          getMovieDetails(id),
          getRecommendedMovies(id) 
        ]);

        // --- 💡 THIS IS THE FIX ---
        // Check for the 'body' property from the Netlify Function
        let movieData;
        if (detailsResponse.data.body) {
          movieData = JSON.parse(detailsResponse.data.body);
        } else {
          movieData = detailsResponse.data;
        }

        let recommendationsData;
        if (recommendResponse.data.body) {
          recommendationsData = JSON.parse(recommendResponse.data.body);
        } else {
          recommendationsData = recommendResponse.data;
        }
        // --- END OF FIX ---
        
        setMovie(movieData);
        setRecommendedMovies(recommendationsData.results); 

        const videos = movieData?.videos?.results || [];
        const videoToPlay = 
          videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ||
          videos.find((video) => video.site === 'YouTube');

        if (videoToPlay) {
          setTrailerKey(videoToPlay.key);
        }

        setError(null);

      } catch (err) {
        setError('Failed to fetch movie details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]); 


  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  if (!movie) return null; 

  const getImageUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;

  // 5. Options for the react-youtube player
  const playerOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={4} className="text-center text-md-start">
          <Image src={getImageUrl(movie.poster_path)} fluid rounded />
        </Col>
        <Col md={8}>
          <h2>{movie.title}</h2>
          <p className="text-muted">{movie.tagline}</p>
          <p>{movie.overview}</p>
          
          <div className="mb-3">
            <strong>Rating: </strong>
            <FaStar className="text-warning mb-1" /> {movie.vote_average.toFixed(1)} / 10
          </div>
          
          <div className="mb-3">
            <strong>Runtime: </strong>
            <FaClock className="me-1" /> {movie.runtime} minutes
          </div>

          <div className="mb-3">
            <strong>Genres: </strong>
            {movie.genres.map(genre => (
              <Badge pill bg="info" className="me-2" key={genre.id}>
                {genre.name}
              </Badge>
            ))}
          </div>

          <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Visit Website
          </a>

          {/* 6. Button logic is the same */}
          {trailerKey && (
            <Button 
              variant="outline-dark"
              className="ms-2" 
              onClick={() => setShowPlayer(!showPlayer)}
            >
              <FaPlayCircle className="me-1" /> 
              {showPlayer ? 'Hide Trailer' : 'Watch Trailer'}
            </Button>
          )}

          {/* 7. Render the new <YouTube> component */}
          {showPlayer && trailerKey && (
            // --- 💡 UPDATED THIS LINE ---
            <div className="ratio ratio-16x9 mt-4 rounded overflow-hidden">
              <YouTube 
                videoId={trailerKey} 
                opts={playerOptions}
                className="youtube-player" // For direct styling
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </Col>
      </Row>

      {/* --- Recommendations Section --- */}
      <hr className="my-5" />
      <h3 className="mb-4">Recommendations</h3>
      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {recommendedMovies.length > 0 ? ( 
          recommendedMovies.slice(0, 5).map((movie) => ( 
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <Col>
            <p>No recommendations found.</p> 
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default MovieDetailsPage;