// src/services/tmdbApi.js
import axios from 'axios';

// The base URL is now our *own* serverless function
const apiClient = axios.create({
  baseURL: '/.netlify/functions/tmdb',
});

// We now pass the TMDB path as a 'path' parameter
export const getTrendingMovies = (page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/trending/movie/week',
      page: page,
    },
  });
};

export const searchMovies = (query, page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/search/movie',
      query: query,
      page: page,
    },
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
    params: {
      path: `/movie/${movieId}/recommendations`,
    },
  });
};

export const getMovieCredits = (movieId) => {
  return apiClient.get('', {
    params: {
      path: `/movie/${movieId}/credits`,
    },
  });
};

export const getPersonDetails = (personId) => {
  return apiClient.get('', {
    params: {
      path: `/person/${personId}`,
    },
  });
};

export const getPersonMovieCredits = (personId) => {
  return apiClient.get('', {
    params: {
      path: `/person/${personId}/movie_credits`,
    },
  });
};

// --- 👇 ADD THIS NEW FUNCTION ---
export const getMoviesByGenre = (genreId, page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/discover/movie',
      with_genres: genreId,
      page: page,
    },
  });
};