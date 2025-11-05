// src/services/tmdbApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/.netlify/functions/tmdb',
});

// --- Existing Functions ---
export const getTrendingAll = (page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/trending/all/week',
      page: page,
    },
  });
};

export const getTrendingMovies = (page = 1) => {
  return apiClient.get('', {
    params: { path: '/trending/movie/week', page: page },
  });
};

export const searchMovies = (query, page = 1) => {
  return apiClient.get('', {
    params: { path: '/search/movie', query: query, page: page },
  });
};

export const getMovieDetails = (movieId) => {
  return apiClient.get('', {
    params: {
      path: `/movie/${movieId}`,
      append_to_response: 'videos,release_dates',
    },
  });
};

export const getRecommendedMovies = (movieId) => {
  return apiClient.get('', {
    params: { path: `/movie/${movieId}/recommendations` },
  });
};

export const getMovieCredits = (movieId) => {
  return apiClient.get('', { params: { path: `/movie/${movieId}/credits` } });
};

export const getPersonDetails = (personId) => {
  return apiClient.get('', { params: { path: `/person/${personId}` } });
};

export const getPersonMovieCredits = (personId) => {
  return apiClient.get('', {
    params: { path: `/person/${personId}/movie_credits` },
  });
};

export const getMoviesByGenre = (genreId, page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/discover/movie',
      with_genres: genreId,
      page: page,
    },
  });
};

export const getPopularTvShows = (page = 1) => {
  return apiClient.get('', { params: { path: '/tv/popular', page: page } });
};

export const getTopRatedMovies = (page = 1) => {
  return apiClient.get('', {
    params: { path: '/movie/top_rated', page: page },
  });
};

export const getUpcomingMovies = (page = 1) => {
  return apiClient.get('', {
    params: { path: '/movie/upcoming', page: page },
  });
};

export const getAnime = (page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/discover/tv',
      with_genres: 16,
      page: page,
    },
  });
};

export const getTopRatedTvShows = (page = 1) => {
  return apiClient.get('', {
    params: { path: '/tv/top_rated', page: page },
  });
};

export const getMoviesByGenreId = (genreId, page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/discover/movie',
      with_genres: genreId,
      page: page,
    },
  });
};

export const getTvShowsByGenreId = (genreId, page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/discover/tv',
      with_genres: genreId,
      page: page,
    },
  });
};

export const getMoviesByKeyword = (keywordId, page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/discover/movie',
      with_keywords: keywordId,
      page: page,
    },
  });
};

export const getRomComMovies = (page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/discover/movie',
      with_genres: '10749,35', // Romance (10749) AND Comedy (35)
      page: page,
    },
  });
};

// --- 👇 ADD THIS NEW FUNCTION ---

/**
 * Fetches Romantic Comedy TV Shows (Genre 10749 AND 35)
 */
export const getRomComTvShows = (page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/discover/tv',
      with_genres: '10749,35', // Romance (10749) AND Comedy (35)
      page: page,
    },
  });
};