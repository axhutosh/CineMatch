// src/pages/MoviesPage.jsx
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CategoryRow from '../components/CategoryRow';
import { 
  getTrendingMovies, 
  getTopRatedMovies, 
  getUpcomingMovies,
  getMoviesByKeyword,
  getMoviesByGenreId,
  getRomComMovies, // 1. Import new function
} from '../services/tmdbApi';

const MoviesPage = () => {

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <Container className="pb-5">
      <h1 className="my-4 text-center">Movies</h1>
      
      <CategoryRow 
        title="Trending Movies" 
        fetchDataFunction={getTrendingMovies}
      />
      
      <CategoryRow 
        title="Top Rated Movies" 
        fetchDataFunction={getTopRatedMovies} 
      />
      
      <CategoryRow 
        title="Upcoming Movies" 
        fetchDataFunction={getUpcomingMovies} 
      />

      <CategoryRow 
        title="Action" 
        fetchDataFunction={() => getMoviesByGenreId(28)} // Action
        seeAllLink="/discover/genre/28" 
      />

      <CategoryRow 
        title="Comedy" 
        fetchDataFunction={() => getMoviesByGenreId(35)} // Comedy
        seeAllLink="/discover/genre/35" 
      />

      {/* 2. ADD THE NEW ROW */}
      <CategoryRow 
        title="Rom-Coms" 
        fetchDataFunction={getRomComMovies} 
      />
      
      <CategoryRow 
        title="Thrillers" 
        fetchDataFunction={() => getMoviesByGenreId(53)} // Thriller
        seeAllLink="/discover/genre/53" 
      />

      <CategoryRow 
        title="Sci-Fi" 
        fetchDataFunction={() => getMoviesByGenreId(878)} // Sci-Fi
        seeAllLink="/discover/genre/878" 
      />
      
      <CategoryRow 
        title="Superhero" 
        fetchDataFunction={() => getMoviesByKeyword(9715)} // Superhero
      />

    </Container>
  );
};

export default MoviesPage;