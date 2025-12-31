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

// 👇 UPDATED FUNCTION (Fixed to fetch Cast & Recs)
export const getMovieDetails = (movieId) => {
  return apiClient.get('', {
    params: {
      path: `/movie/${movieId}`,
      // ⚡️ ADDED: credits, recommendations, similar, images
      append_to_response: 'videos,release_dates,credits,recommendations,similar,images',
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

export const getMovieVideos = (movieId) => {
  return apiClient.get('', { params: { path: `/movie/${movieId}/videos` } });
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
      with_genres: '10749,35', 
      page: page,
    },
  });
};

export const getRomComTvShows = (page = 1) => {
  return apiClient.get('', {
    params: {
      path: '/discover/tv',
      with_genres: '10749,35',
      page: page,
    },
  });
};

export const getMassiveWallData = async () => {
  const pagesToFetch = Array.from({ length: 50 }, (_, i) => i + 1);
  
  const requests = pagesToFetch.map(page => 
    apiClient.get('', { params: { path: '/trending/all/week', page: page } })
  );

  const responses = await Promise.all(requests);

  let allMovies = [];
  responses.forEach(response => {
    let data = response.data.body ? JSON.parse(response.data.body) : response.data;
    if (data.results) {
      allMovies = [...allMovies, ...data.results];
    }
  });

  return allMovies.sort(() => Math.random() - 0.5);
};

export const getTvDetails = (tvId) => {
  return apiClient.get('', {
    params: {
      path: `/tv/${tvId}`,
      append_to_response: 'videos,credits,recommendations,similar',
    },
  });
};