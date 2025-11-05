// src/pages/TVShowsPage.jsx
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CategoryRow from '../components/CategoryRow';
import { 
  getPopularTvShows, 
  getTopRatedTvShows,
  getTvShowsByGenreId,
  getAnime, 
  getRomComTvShows, // 1. Import new function
} from '../services/tmdbApi';

const TVShowsPage = () => {

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <Container className="pb-5">
      <h1 className="my-4 text-center">TV Shows</h1>
      
      <CategoryRow 
        title="Popular TV Shows" 
        fetchDataFunction={getPopularTvShows}
      />
      
      <CategoryRow 
        title="Top Rated TV Shows" 
        fetchDataFunction={getTopRatedTvShows} 
      />
      
      <CategoryRow 
        title="Anime" 
        fetchDataFunction={getAnime} 
        seeAllLink="/anime" 
      />
      
      <CategoryRow 
        title="TV Dramas" 
        fetchDataFunction={() => getTvShowsByGenreId(18)} // Drama
      />

      <CategoryRow 
        title="TV Comedies" 
        fetchDataFunction={() => getTvShowsByGenreId(35)} // Comedy
      />

      {/* 2. ADD THE NEW ROW */}
      <CategoryRow 
        title="Rom-Coms" 
        fetchDataFunction={getRomComTvShows} 
      />

      <CategoryRow 
        title="Sci-Fi & Fantasy" 
        fetchDataFunction={() => getTvShowsByGenreId(10765)} // Sci-Fi & Fantasy
      />
      
      <CategoryRow 
        title="Documentaries" 
        fetchDataFunction={() => getTvShowsByGenreId(99)} // Documentary
      />

    </Container>
  );
};

export default TVShowsPage;