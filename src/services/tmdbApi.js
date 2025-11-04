// src/services/tmdbApi.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

/**
 * Fetches trending movies for a specific page.
 * @param {number} page - The page number to fetch.
 * @returns {Promise<Object>} A promise that resolves to the API response.
 */
export const getTrendingMovies = (page = 1) => { // 1. Add page parameter
  return apiClient.get('/trending/movie/week', {
    params: {
      page: page, // 2. Pass page to the API
    },
  });
};

/**
 * Searches for movies based on a query and page.
 * @param {string} query - The search term.
 * @param {number} page - The page number to fetch.
 * @returns {Promise<Object>} A promise that resolves to the API response.
 */
export const searchMovies = (query, page = 1) => { // 3. Add page parameter
  return apiClient.get('/search/movie', {
    params: {
      query: query,
      page: page, // 4. Pass page to the API
    },
  });
};

/**
 * Fetches details for a specific movie, including videos.
 */
export const getMovieDetails = (movieId) => {
  return apiClient.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'videos',
    },
  });
};

/**
 * Fetches recommended movies for a specific movie.
 */
export const getRecommendedMovies = (movieId) => {
  return apiClient.get(`/movie/${movieId}/recommendations`);
};