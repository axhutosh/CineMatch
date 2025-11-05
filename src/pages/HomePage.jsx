// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CategoryRow from '../components/CategoryRow';
import { 
  getTrendingAll, 
  getTopRatedMovies,
  getPopularTvShows, 
  getMoviesByKeyword,
  getTopRatedTvShows, // 1. Import Top Rated TV
  getAnime 
} from '../services/tmdbApi';

const HomePage = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <Container className="pb-5">
      
      <CategoryRow 
        title="Trending Now" 
        fetchDataFunction={getTrendingAll} 
      />
      
      <CategoryRow 
        title="Must Watch Movies" // Renamed for clarity
        fetchDataFunction={getTopRatedMovies} 
        seeAllLink="/movies" 
      />
      
      <CategoryRow 
        title="Popular TV Shows" 
        fetchDataFunction={getPopularTvShows} 
        seeAllLink="/tv"
      />
      
      {/* --- 2. REPLACED SEASONAL ROW --- */}
      <CategoryRow 
        title="Superhero Movies" 
        // Keyword ID 9715 = "superhero" (much more reliable)
        fetchDataFunction={() => getMoviesByKeyword(9715)}
      />
      {/* --- END OF CHANGE --- */}
      
      {/* --- 3. ADDED NEW ROW --- */}
      <CategoryRow 
        title="Top Rated TV" 
        fetchDataFunction={getTopRatedTvShows}
        seeAllLink="/tv"
      />
      {/* --- END OF NEW ROW --- */}

      <CategoryRow 
        title="Anime" 
        fetchDataFunction={getAnime} 
        seeAllLink="/anime" 
      />

    </Container>
  );
};

export default HomePage;