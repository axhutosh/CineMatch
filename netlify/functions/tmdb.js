// netlify/functions/tmdb.js
import { default as axios } from 'axios';

// Get the private key from Netlify's environment variables
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const handler = async (event) => {
  // Get the path and params from the client request
  // e.g., /?path=/trending/movie/week&page=1
  const { path, ...params } = event.queryStringParameters;

  if (!path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No API path provided' }),
    };
  }

  try {
    // Make the secure request to TMDB, adding the API key
    const { data } = await axios.get(`${BASE_URL}${path}`, {
      params: {
        api_key: API_KEY, // Add the secret key here
        ...params,       // Pass along other params like 'query', 'page', etc.
      },
    });

    // Send the data back to the React app
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Handle errors
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};