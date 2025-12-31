// src/pages/MovieDetailsPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import { FaStar, FaPlay, FaHeart, FaRegHeart, FaYoutube, FaDownload, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getMovieDetails, getTvDetails } from '../services/tmdbApi';
import { addFavorite, removeFavorite, isFavorite } from '../utils/favorites';
import MovieCard from '../components/MovieCard';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [ratingCert, setRatingCert] = useState('NR');
  
  const [showBgVideo, setShowBgVideo] = useState(false);
  const timerRef = useRef(null);

  const castScrollRef = useRef(null);
  const recScrollRef = useRef(null);

  const isTv = location.pathname.includes('/tv/');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setShowTrailer(false);
        setShowBgVideo(false);
        if (timerRef.current) clearTimeout(timerRef.current);

        const fetchFunction = isTv ? getTvDetails : getMovieDetails;
        const response = await fetchFunction(id);
        const data = response.data.body ? JSON.parse(response.data.body) : response.data;
        
        setMovie(data);
        setIsFav(isFavorite(data.id));

        const videos = data.videos?.results || [];
        const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') 
                     || videos.find(v => v.site === 'YouTube');
        
        if (trailer) {
          setTrailerKey(trailer.key);
          timerRef.current = setTimeout(() => {
            setShowBgVideo(true);
          }, 1500);
        } else {
          setTrailerKey(null);
        }

        let cert = 'NR';
        if (isTv) {
          const contentRatings = data.content_ratings?.results || [];
          const usRating = contentRatings.find(r => r.iso_3166_1 === 'US');
          if (usRating) cert = usRating.rating;
        } else {
          const releases = data.release_dates?.results || [];
          const usRelease = releases.find(r => r.iso_3166_1 === 'US');
          if (usRelease) {
            const found = usRelease.release_dates.find(d => d.certification !== '');
            if (found) cert = found.certification;
          }
        }
        setRatingCert(cert);

      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, isTv]);

  const handleFavorite = () => {
    if (isFav) {
      removeFavorite(movie.id);
      setIsFav(false);
    } else {
      addFavorite(movie);
      setIsFav(true);
    }
  };

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { current } = ref;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
      <Spinner animation="border" variant="light" />
    </div>
  );
  
  if (!movie) return <div className="text-center text-white p-5 mt-5">Content not found</div>;

  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  const year = date ? date.split('-')[0] : 'N/A';
  const runtime = movie.runtime 
    ? `${movie.runtime}m` 
    : (movie.episode_run_time?.[0] ? `${movie.episode_run_time[0]}m` : 'N/A');
  
  const recommendations = movie.recommendations?.results || movie.similar?.results || [];
  const cast = movie.credits?.cast || [];

  const ScrollBtn = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: 0,
        bottom: '16px',
        [direction]: 0,
        zIndex: 10,
        width: '50px',
        border: 'none',
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        background: direction === 'left' 
          ? 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)'
          : 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, transparent 100%)',
        opacity: 0.5,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.background = direction === 'left' 
          ? 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 100%)'
          : 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 100%)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.5';
        e.currentTarget.style.background = direction === 'left' 
          ? 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)'
          : 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, transparent 100%)';
      }}
    >
      {direction === 'left' ? <FaChevronLeft size={28} /> : <FaChevronRight size={28} />}
    </button>
  );

  return (
    <div className="text-white bg-black" style={{ minHeight: '100vh' }}>
      
      {/* 🎥 HERO SECTION */}
      <div 
        style={{
          position: 'relative',
          marginTop: '-90px',
          paddingTop: '150px',
          paddingBottom: '80px',
          marginBottom: '20px',
          overflow: 'hidden',
          minHeight: '100vh' 
        }}
      >
        {/* 1. BACKGROUND LAYER */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {showBgVideo && trailerKey && !showTrailer ? (
             <iframe
               src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0`}
               title="Background Video"
               frameBorder="0"
               allow="autoplay; encrypted-media"
               style={{ 
                 position: 'absolute', 
                 top: '50%', 
                 left: '30%',
                 width: '90vw', 
                 height: '65vw',
                 minHeight: '110vh', 
                 transform: 'translateY(-50%)',
                 pointerEvents: 'none',
                 filter: 'brightness(0.8)'
               }}
             />
          ) : (
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                transition: 'background-image 0.5s ease-in-out'
              }}
            />
          )}
        </div>

        {/* 2. GRADIENT OVERLAYS */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #000 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.2) 100%)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '200px', background: 'linear-gradient(to bottom, #000 10%, transparent 100%)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '300px', background: 'linear-gradient(to top, #000 20%, transparent 100%)', zIndex: 1 }}></div>

        {/* 3. CONTENT LAYER */}
        <Container style={{ position: 'relative', zIndex: 2 }}>
          <Row className="align-items-start">
            
            <Col md={7} lg={6}> 
              
              <div className="d-flex align-items-center gap-2 mb-2">
                <h1 className="display-4 fw-bold mb-0" style={{ textShadow: '2px 2px 4px #000' }}>{title}</h1>
                <button 
                  onClick={handleFavorite} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: 0, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Add to Favorites"
                >
                  {isFav ? (
                    <FaHeart size={36} color="#dc3545" /> 
                  ) : (
                    <FaRegHeart size={36} color="#dc3545" /> 
                  )}
                </button>
              </div>

              {movie.tagline && (
                <p className="fs-5 text-white-50 fst-italic mb-3" style={{ textShadow: '1px 1px 2px #000' }}>
                  {movie.tagline}
                </p>
              )}
              
              <div className="d-flex align-items-center gap-3 mb-3 text-white-50 fw-bold" style={{ fontSize: '0.95rem' }}>
                <span className="text-white border border-secondary px-2 py-0 rounded bg-dark">{ratingCert}</span>
                <span>{year}</span>
                <span>•</span>
                <span>{runtime}</span>
                <span>•</span>
                <span className="text-warning d-flex align-items-center gap-1">
                  <FaStar /> {movie.vote_average?.toFixed(1)}
                </span>
              </div>
              
              <div className="mb-4">
                {movie.genres?.map(g => (
                  <Link 
                    key={g.id} 
                    to={`/genre/${isTv ? 'tv' : 'movie'}/${g.id}/${encodeURIComponent(g.name)}`} 
                    style={{ textDecoration: 'none' }}
                  >
                    <Badge 
                      bg="danger" 
                      className="me-2 px-3 py-2 fw-normal"
                      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      {g.name}
                    </Badge>
                  </Link>
                ))}
              </div>

              <p className="lead text-light" style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.95, textShadow: '1px 1px 2px #000' }}>
                {movie.overview}
              </p>
              
              <div className="d-flex flex-wrap align-items-center gap-3 mt-4">
                {trailerKey && (
                  <Button 
                    variant={showTrailer ? "outline-light" : "light"}
                    className="rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                    onClick={() => setShowTrailer(!showTrailer)}
                  >
                    {showTrailer ? <FaTimes /> : <FaPlay size={14} />} 
                    {showTrailer ? "Close Trailer" : "Watch Trailer"}
                  </Button>
                )}

                <a 
                   href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + " full movie")}`}
                   target="_blank" rel="noreferrer"
                   className="btn btn-danger rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                   style={{ textDecoration: 'none' }}
                >
                  <FaYoutube size={18} /> Watch Now
                </a>

                <Button 
                  disabled 
                  variant="secondary"
                  className="rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                  <FaDownload size={14} /> Download
                </Button>
              </div>

              {showTrailer && trailerKey && (
                <div className="mt-4 rounded overflow-hidden shadow-lg animate-fade-in" style={{ maxWidth: '800px', aspectRatio: '16/9' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

            </Col>
            
            <Col md={5} lg={6}></Col>
          </Row>
        </Container>
      </div>

      {/* ⚡️ CAST ROW: Clickable Links Added Here */}
      {cast.length > 0 && (
        <Container className="mb-5 position-relative">
          <h4 className="mb-3 text-white fw-bold">Top Cast</h4>
          
          <div className="position-relative">
            <ScrollBtn direction="left" onClick={() => scroll(castScrollRef, 'left')} />
            
            <div 
              ref={castScrollRef}
              className="d-flex overflow-auto pb-3 px-4" 
              style={{ gap: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
            >
              {cast.slice(0, 15).map(person => (
                // ⚡️ FIX: Wrapped in Link to /person/:id
                <Link 
                  key={person.id} 
                  to={`/person/${person.id}`} 
                  className="text-decoration-none text-white"
                >
                  <div className="text-center hover-scale" style={{ minWidth: '110px' }}>
                    <img 
                      src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Img'}
                      alt={person.name}
                      className="rounded-circle mb-2 object-fit-cover shadow-sm"
                      style={{ width: '90px', height: '90px', border: '2px solid #333' }}
                    />
                    <p className="small mb-0 fw-bold text-truncate" style={{ maxWidth: '110px' }}>{person.name}</p>
                    <p className="small text-secondary text-truncate" style={{ maxWidth: '110px' }}>{person.character}</p>
                  </div>
                </Link>
              ))}
            </div>

            <ScrollBtn direction="right" onClick={() => scroll(castScrollRef, 'right')} />
          </div>
        </Container>
      )}

      {/* RECOMMENDATIONS ROW */}
      {recommendations.length > 0 && (
        <Container className="pb-5 position-relative">
          <h4 className="mb-3 text-white fw-bold">More Like This</h4>
          
          <div className="position-relative">
            <ScrollBtn direction="left" onClick={() => scroll(recScrollRef, 'left')} />
            
            <div 
              ref={recScrollRef}
              className="d-flex overflow-auto pb-3 pt-2 px-4"
              style={{ gap: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
            >
              {recommendations.slice(0, 15).map(item => (
                <MovieCard 
                  key={item.id} 
                  item={item} 
                  style={{ width: '160px', minWidth: '160px' }}
                />
              ))}
            </div>

            <ScrollBtn direction="right" onClick={() => scroll(recScrollRef, 'right')} />
          </div>
        </Container>
      )}
    </div>
  );
};

export default MovieDetailsPage;