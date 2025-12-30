// src/pages/ClassicHome.jsx
import React, { useEffect, useState } from 'react';
import { Container, Carousel, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getTrendingMovies, getMoviesByGenre, getTopRatedMovies } from '../services/tmdbApi'; 

const ClassicHome = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [categories, setCategories] = useState({
    trending: [],
    topRated: [],
    action: [],
    comedy: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, topRated, action, comedy] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies(),
          getMoviesByGenre(28), 
          getMoviesByGenre(35) 
        ]);

        const parse = (res) => {
           const body = res.data.body ? JSON.parse(res.data.body) : res.data;
           return body.results || [];
        };

        const trendingList = parse(trending);
        setHeroMovies(trendingList.slice(0, 5)); 
        
        setCategories({
          trending: trendingList,
          topRated: parse(topRated),
          action: parse(action),
          comedy: parse(comedy)
        });
      } catch (error) {
        console.error("Error loading classic home:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  const ScrollCard = ({ movie }) => (
    <Link to={`/movie/${movie.id}`} className="text-decoration-none">
      <div 
        style={{ 
          minWidth: '160px', width: '160px', cursor: 'pointer', transition: 'transform 0.3s'
        }}
        className="movie-scroll-card"
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img 
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
          alt={movie.title}
          style={{ 
            width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.5)', aspectRatio: '2/3', objectFit: 'cover'
          }}
        />
        <h6 className="text-white mt-2 text-truncate" style={{ fontSize: '0.9rem' }}>
          {movie.title}
        </h6>
      </div>
    </Link>
  );

  const MovieRow = ({ title, movies }) => {
    if (!movies || movies.length === 0) return null;
    return (
      <div className="mb-5">
        <h3 className="text-white mb-3 px-4 fw-bold">{title}</h3>
        <div 
          className="d-flex overflow-auto px-4 pb-3" 
          style={{ gap: '20px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map(movie => (
            <ScrollCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  };

  return (
    // 💡 REMOVED paddingTop: '80px' so the gradient blends directly with navbar
    <div className="bg-black" style={{ minHeight: '100vh', paddingBottom: '50px' }}>
      
      {heroMovies.length > 0 && (
        <Carousel fade indicators={false} interval={5000} className="mb-5">
          {heroMovies.map((movie) => (
            <Carousel.Item key={movie.id} style={{ height: '70vh' }}>
              
              {/* 💡 1. TOP GRADIENT (The Fade from Navbar) */}
              <div 
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', 
                  height: '30%', // Covers top 30% of screen
                  background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                  zIndex: 2
                }}
              />

              {/* 💡 2. BOTTOM GRADIENT (For Text Readability) */}
              <div 
                style={{
                  position: 'absolute', bottom: 0, left: 0, width: '100%', 
                  height: '60%', 
                  background: 'linear-gradient(to top, #000 10%, rgba(0,0,0,0.8) 50%, transparent 100%)',
                  zIndex: 2
                }}
              />
              
              <img
                className="d-block w-100 h-100"
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
              />
              
              <Carousel.Caption 
                style={{ 
                  zIndex: 3, textAlign: 'left', left: '5%', bottom: '15%',
                  color: '#fff', textShadow: '2px 2px 8px rgba(0,0,0,0.9)'
                }}
              >
                <h1 className="display-3 fw-bold">{movie.title}</h1>
                <p 
                  className="lead d-none d-md-block" 
                  style={{ maxWidth: '600px', fontWeight: '500', textShadow: '1px 1px 5px rgba(0,0,0,1)' }}
                >
                  {movie.overview ? movie.overview.slice(0, 150) + "..." : ""}
                </p>
                <Link 
                  to={`/movie/${movie.id}`} 
                  className="btn btn-danger btn-lg mt-3 fw-bold px-4 rounded-pill shadow-lg"
                >
                  Check It Out
                </Link>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      <Container fluid className="p-0">
        <MovieRow title="Trending Now" movies={categories.trending} />
        <MovieRow title="Top Rated" movies={categories.topRated} />
        <MovieRow title="Action Hits" movies={categories.action} />
        <MovieRow title="Comedy Picks" movies={categories.comedy} />
      </Container>
    </div>
  );
};

export default ClassicHome;