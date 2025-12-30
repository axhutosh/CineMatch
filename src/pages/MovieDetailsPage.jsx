// src/pages/MovieDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getRecommendedMovies, getMovieCredits } from '../services/tmdbApi';
import { Container, Row, Col, Image, Spinner, Alert, Badge, Button } from 'react-bootstrap'; 
import { FaStar, FaClock, FaPlayCircle, FaHeart, FaRegHeart } from 'react-icons/fa'; 
import MovieCard from '../components/MovieCard';
import YouTube from 'react-youtube';
import { addFavorite, removeFavorite, isFavorite } from '../utils/favorites'; 

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [rating, setRating] = useState('');
  const [trailerKey, setTrailerKey] = useState(null); 
  const [showPlayer, setShowPlayer] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setTrailerKey(null);
        setShowPlayer(false);
        setRating(''); 
        
        const [detailsResponse, recommendResponse, creditsResponse] = await Promise.all([
          getMovieDetails(id), 
          getRecommendedMovies(id),
          getMovieCredits(id) 
        ]);

        const parseData = (res) => res.data.body ? JSON.parse(res.data.body) : res.data;

        const movieData = parseData(detailsResponse);
        const recommendationsData = parseData(recommendResponse);
        const creditsData = parseData(creditsResponse); 
        
        setMovie(movieData);
        setRecommendedMovies(recommendationsData.results || []); 
        setCast(creditsData.cast || []); 
        setIsFav(isFavorite(movieData.id));

        // --- RATING LOGIC ---
        const usRelease = movieData.release_dates?.results.find(
          (r) => r.iso_3166_1 === 'US'
        );
        let certification = usRelease?.release_dates.find(
          (r) => r.certification
        )?.certification;
        if (!certification) {
          const anyRelease = movieData.release_dates?.results.find(
            (r) => r.release_dates.length > 0 && r.release_dates.find(d => d.certification)
          );
          if (anyRelease) {
            certification = anyRelease.release_dates.find(d => d.certification).certification;
          }
        }
        setRating(certification || 'NR');
        // --- END RATING ---

        // --- TRAILER LOGIC ---
        const videos = movieData?.videos?.results || [];
        const videoToPlay = 
          videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ||
          videos.find((video) => video.site === 'YouTube');
        if (videoToPlay) {
          setTrailerKey(videoToPlay.key);
        }
        // --- END TRAILER ---

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

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(movie.id);
      setIsFav(false);
    } else {
      addFavorite(movie);
      setIsFav(true);
    }
  };

  // --- 💡 NEW WATCH HANDLER 💡 ---
  const handleWatchNow = () => {
    if (!movie) return;
    // Logic: "Movie Title" + "full movie"
    const query = `${movie.title} full movie`;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(youtubeUrl, '_blank');
  };

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

  const getImageUrl = (path, size = "w500") => `https://image.tmdb.org/t/p/${size}${path}`;

  const playerOptions = {
    height: '100%',
    width: '100%',
    playerVars: { autoplay: 1 },
  };

  return (
    <Container className="mt-5 pb-5"> 
      <Row>
        <Col md={4} className="text-center text-md-start">
          <Image src={getImageUrl(movie.poster_path)} fluid rounded />
        </Col>
        <Col md={8}>
          
          <div className="d-flex align-items-center mb-2">
            <h2 className="mb-0 me-3">{movie.title}</h2>
            <Button
              variant="link"
              className="p-0 fs-3 text-danger"
              onClick={handleFavoriteClick}
              aria-label="Add to favorites"
              style={{ textDecoration: 'none' }}
            >
              {isFav ? <FaHeart /> : <FaRegHeart />}
            </Button>
          </div>

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
              <Link 
                to={`/discover/genre/${genre.id}`}
                key={genre.id}
                state={{ genreName: genre.name }}
                className="text-decoration-none"
              >
                <Badge 
                  pill 
                  bg="info" 
                  className="me-2" 
                  style={{cursor: 'pointer'}}
                >
                  {genre.name}
                </Badge>
              </Link>
            ))}
          </div>

          {rating && (
            <div className="mb-3">
              <strong>Parental Rating: </strong>
              <Badge pill bg="info" className="me-2">
                {rating}
              </Badge>
            </div>
          )}

          {/* --- 💡 REPLACED "VISIT WEBSITE" WITH "WATCH NOW" 💡 --- */}
          <button 
            className="btn btn-danger" 
            onClick={handleWatchNow}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              borderRadius: '20px', 
              padding: '8px 24px',
              fontWeight: 'bold',
              border: 'none',
              transition: 'transform 0.2s',
              marginRight: '10px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              fill="currentColor" 
              viewBox="0 0 16 16"
            >
              <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
            </svg>
            Watch Now
          </button>

          {trailerKey && (
            <Button 
              variant="outline-light"
              className="ms-2" 
              onClick={() => setShowPlayer(!showPlayer)}
            >
              <FaPlayCircle className="me-1" /> 
              {showPlayer ? 'Hide Trailer' : 'Watch Trailer'}
            </Button>
          )}

          {showPlayer && trailerKey && (
            <div className="ratio ratio-16x9 mt-4 rounded overflow-hidden">
              <YouTube 
                videoId={trailerKey} 
                opts={playerOptions}
                className="youtube-player"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </Col>
      </Row>

      {/* --- CAST SECTION --- */}
      <hr className="my-5" />
      <h3 className="mb-4">Top Cast</h3>
      <div className="cast-scroller">
        <Row className="flex-nowrap">
          {cast.slice(0, 10).map((actor) => ( 
            <Col xs={4} sm={3} md={2} key={actor.cast_id} className="cast-card">
              <Link 
                to={`/person/${actor.id}`} 
                className="text-decoration-none text-light"
              >
                <Image 
                  src={actor.profile_path ? getImageUrl(actor.profile_path, "w200") : 'https://via.placeholder.com/200x300.png?text=No+Image'} 
                  roundedCircle 
                  className="cast-img"
                />
                <strong className="d-block mt-2">{actor.name}</strong>
                <span className="text-white-50">{actor.character}</span>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

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