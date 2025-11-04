// netlify/functions/tmdb.cjs
// No more 'require('axios')'!

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

exports.handler = async (event) => {
  const { path, ...params } = event.queryStringParameters;

  if (!path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No API path provided' }),
    };
  }

  // Manually build the query string
  // This turns { page: 1, query: 'test' } into 'page=1&query=test'
  const queryString = new URLSearchParams({
    api_key: API_KEY, // Add the secret key here
    ...params,
  }).toString();

  const url = `${BASE_URL}${path}?${queryString}`;

  try {
    // Use built-in 'fetch'
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      // If the API returned an error (like 401, 404)
      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    // Send the data back to the React app
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Handle network errors or other fetch failures
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};