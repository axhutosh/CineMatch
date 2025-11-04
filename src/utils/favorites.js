// src/utils/favorites.js

// The key we'll use in localStorage
const FAVORITES_KEY = 'movieAppFavorites';

/**
 * Gets the list of all favorite movie objects from localStorage
 * @returns {Array} An array of movie objects
 */
export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

/**
 * Saves a movie to the favorites list in localStorage
 * @param {Object} movie - The movie object to save
 */
export const addFavorite = (movie) => {
  const favorites = getFavorites();
  // Add the new movie (if it's not already there)
  if (!favorites.find(fav => fav.id === movie.id)) {
    const newFavorites = [...favorites, movie];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }
};

/**
 * Removes a movie from the favorites list in localStorage
 * @param {number} movieId - The ID of the movie to remove
 */
export const removeFavorite = (movieId) => {
  const favorites = getFavorites();
  const newFavorites = favorites.filter(movie => movie.id !== movieId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
};

/**
 * Checks if a movie is already in the favorites list
 * @param {number} movieId - The ID of the movie to check
 * @returns {boolean} True if the movie is a favorite, false otherwise
 */
export const isFavorite = (movieId) => {
  const favorites = getFavorites();
  return !!favorites.find(movie => movie.id === movieId);
};