// src/pages/ClassicHome.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Container, Carousel, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  getTrendingMovies, 
  getTopRatedMovies,
  getPopularTvShows,
  getAnime,
  getUpcomingMovies,
  getTopRatedTvShows,
  getMoviesByGenreId,
  getMovieVideos 
} from '../services/tmdbApi'; 
import { FaPlay, FaYoutube, FaChevronRight } from 'react-icons/fa'; 
import MovieCard from '../components/MovieCard';

const ClassicHome = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  
  // 10 Categories
  const [categories, setCategories] = useState({
    topRated: [],
    trendingTv: [],
    anime: [],
    newReleases: [],
    action: [],
    bingeTv: [],
    kids: [],
    scifi: [],
    comedy: [],
    romance: []
  });
  const [loading, setLoading] = useState(true);

  // VIDEO STATES
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoKey, setVideoKey] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          carouselRes,
          topRatedRes,
          tvRes,
          animeRes,
          upcomingRes,
          actionRes,
          bingeRes,
          kidsRes,
          scifiRes,
          comedyRes,
          romanceRes
        ] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies(),
          getPopularTvShows(),
          getAnime(),
          getUpcomingMovies(),
          getMoviesByGenreId(28),
          getTopRatedTvShows(),
          getMoviesByGenreId(10751),
          getMoviesByGenreId(878),
          getMoviesByGenreId(35),
          getMoviesByGenreId(10749)
        ]);

        const parse = (res) => {
           const body = res.data.body ? JSON.parse(res.data.body) : res.data;
           return body.results || [];
        };

        const heroList = parse(carouselRes);
        setHeroMovies(heroList.slice(0, 5)); 
        
        setCategories({
          topRated: parse(topRatedRes),
          trendingTv: parse(tvRes),
          anime: parse(animeRes),
          newReleases: parse(upcomingRes),
          action: parse(actionRes),
          bingeTv: parse(bingeRes),
          kids: parse(kidsRes),
          scifi: parse(scifiRes),
          comedy: parse(comedyRes),
          romance: parse(romanceRes),
        });
      } catch (error) {
        console.error("Error loading classic home:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // DELAY LOGIC
  useEffect(() => {
    if (heroMovies.length === 0) return;

    setShowVideo(false);
    setVideoKey(null);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const currentMovie = heroMovies[activeIndex];
      if (!currentMovie) return;

      try {
        const res = await getMovieVideos(currentMovie.id);
        const videos = res.data.results || [];
        
        const validVideo = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') 
                        || videos.find(v => v.site === 'YouTube');

        if (validVideo) {
          setVideoKey(validVideo.key);
          setShowVideo(true);
        }
      } catch (err) {
        console.error("Failed to fetch video", err);
      }
    }, 1000); 

    return () => clearTimeout(timerRef.current);
  }, [activeIndex, heroMovies]);


  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % heroMovies.length;
    setActiveIndex(nextIndex);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  const MovieRow = ({ title, movies }) => {
    if (!movies || movies.length === 0) return null;
    return (
      <div className="mb-5">
        {/* ⚡️ FIX: Changed px-4 to mx-4. This pushes the whole header (including the red border) away from the wall */}
        <h4 className="text-white mb-3 mx-4 fw-bold border-start border-4 border-danger ps-3">
          {title}
        </h4>
        <div 
          className="d-flex overflow-auto px-4 pb-3 pt-2" 
          style={{ gap: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map(movie => (
            <div key={movie.id} style={{ minWidth: '160px', width: '160px' }}>
                <MovieCard item={movie} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black" style={{ minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* 1. HERO SECTION */}
      {heroMovies.length > 0 && (
        <div className="position-relative mb-0">
          <Carousel 
            activeIndex={activeIndex}
            onSelect={handleSelect}
            fade 
            indicators={false} 
            controls={false}
            interval={null} 
          >
            {heroMovies.map((movie) => (
              <Carousel.Item key={movie.id} style={{ height: '85vh', backgroundColor: '#000' }}>
                
                {/* --- VIDEO LAYER --- */}
                {showVideo && videoKey ? (
                   <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0`}
                        title={movie.title}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          left: '50%', 
                          width: '100vw', 
                          height: '56.25vw', 
                          minHeight: '100vh', 
                          minWidth: '177.77vh', 
                          transform: 'translate(-50%, -50%) scale(1.1)', 
                          pointerEvents: 'none' 
                        }}
                      />
                   </div>
                ) : (
                  <Link to={`/movie/${movie.id}`} style={{ display: 'block', height: '100%' }}>
                    <img
                      className="d-block w-100 h-100"
                      src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                      alt={movie.title}
                      style={{ objectFit: 'cover', objectPosition: 'top center' }}
                    />
                  </Link>
                )}

                {/* Top Gradient */}
                <div 
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', 
                    height: '30%', 
                    background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                    zIndex: 2,
                    pointerEvents: 'none' 
                  }}
                />

                {/* Bottom Gradient */}
                <div 
                  style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', 
                    height: '50%', 
                    background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.8) 50%, transparent 100%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}
                />
                
                {/* Content */}
                <Carousel.Caption 
                  style={{ 
                    zIndex: 100, textAlign: 'left', left: '5%', bottom: '20%', 
                    color: '#fff', textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
                    pointerEvents: 'none' 
                  }}
                >
                  <h1 className="display-3 fw-bold">{movie.title}</h1>
                  <p 
                    className="lead d-none d-md-block" 
                    style={{ maxWidth: '600px', fontWeight: '500', textShadow: '1px 1px 5px rgba(0,0,0,1)' }}
                  >
                    {movie.overview ? movie.overview.slice(0, 150) + "..." : ""}
                  </p>
                  
                  <div className="d-flex gap-3 mt-4" style={{ pointerEvents: 'auto' }}>
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " full movie")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-danger btn-lg fw-bold px-4 rounded-pill shadow-lg d-inline-flex align-items-center gap-2"
                      style={{ textDecoration: 'none' }}
                    >
                      <FaYoutube size={18} /> Watch Now
                    </a>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>

          {/* Next Button */}
          <button 
            onClick={handleNext}
            style={{
              position: 'absolute',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            className="hover-scale"
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 53, 69, 0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      )}

      {/* 2. MOVIE ROWS */}
      <Container 
        fluid 
        className="p-0" 
        style={{ 
          marginTop: '-60px', 
          position: 'relative', 
          zIndex: 10 
        }}
      >
        <MovieRow title="Top Rated Movies" movies={categories.topRated} />
        <MovieRow title="Trending TV Shows" movies={categories.trendingTv} />
        <MovieRow title="Anime Hits" movies={categories.anime} />
        <MovieRow title="New Releases" movies={categories.newReleases} />
        <MovieRow title="Action & Adventure" movies={categories.action} />
        <MovieRow title="Binge-Worthy TV" movies={categories.bingeTv} />
        <MovieRow title="Kids & Family" movies={categories.kids} />
        <MovieRow title="Sci-Fi & Fantasy" movies={categories.scifi} />
        <MovieRow title="Comedy Favorites" movies={categories.comedy} />
        <MovieRow title="Romantic Cinema" movies={categories.romance} />
      </Container>
    </div>
  );
};

export default ClassicHome;