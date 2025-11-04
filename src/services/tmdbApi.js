// src/services/tmdbApi.js
import axios from 'axios';

// No API key here!
// The base URL is now our *own* serverless function
const apiClient = axios.create({
  baseURL: '/.netlify/functions/tmdb',
});

// We now pass the TMDB path as a 'path' parameter
// The function at /tmdb will add the secret key
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
      append_to_response: 'videos',
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