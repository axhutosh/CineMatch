// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
// Link is no longer used directly in this file, so it can be removed if you like.
// import { Link } from 'react-router-dom'; 
import { getTrendingMovies, searchMovies } from '../services/tmdbApi';
import { Container, Row, Col, Spinner, Alert, Pagination } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';

const HomePage = ({ 
  searchQuery, 
  currentPage,
  onPageChange, 
  totalPages,
  setTotalPages 
}) => {
  const [movies, setMovies] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when page or query changes
    window.scrollTo(0, 0); 
    
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = searchQuery
          ? await searchMovies(searchQuery, currentPage)
          : await getTrendingMovies(currentPage);
        
        // --- 💡 THIS IS THE FIX ---
        // Check if we're in `netlify dev` (which returns a 'body' property)
        // or in production (which returns the data directly)
        let tmdbData;
        if (response.data.body) {
          tmdbData = JSON.parse(response.data.body); // Parse the string body
        } else {
          tmdbData = response.data; // Use the data directly
        }
        // --- END OF FIX ---
        console.log(tmdbData);
        // Use the correctly parsed tmdbData
        setMovies(tmdbData.results || []); // Ensure movies is always an array
        setTotalPages(tmdbData.total_pages); 
        setError(null);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error(err);
        setMovies([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, currentPage, setTotalPages]);

  const title = searchQuery ? `Search Results for "${searchQuery}"` : 'Trending This Week';

  if (loading) {
    // Fill in the loading spinner
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading movies...</p>
      </Container>
    );
  }

  if (error) {
    // Fill in the error message
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="my-4 text-center">{title}</h1>
      
      {/* Add a check for no results */}
      {!loading && !error && movies.length === 0 && (
        <Alert variant="info">No movies found.</Alert>
      )}

      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Row>

      {/* --- PAGINATION COMPONENT --- */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center my-4">
          <Pagination>
            {/* Previous Button */}
            <Pagination.Prev 
              onClick={() => onPageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
            />

            {/* First Page */}
            <Pagination.Item 
              active={currentPage === 1} 
              onClick={() => onPageChange(1)}
            >
              1
            </Pagination.Item>

            {/* Ellipsis if needed */}
            {currentPage > 3 && <Pagination.Ellipsis disabled />}
            
            {/* Current Page - 1 */}
            {currentPage > 2 && (
              <Pagination.Item onClick={() => onPageChange(currentPage - 1)}>
                {currentPage - 1}
              </Pagination.Item>
            )}

            {/* Current Page (if not 1 or last) */}
            {currentPage !== 1 && currentPage !== totalPages && (
              <Pagination.Item active>{currentPage}</Pagination.Item>
            )}
            
            {/* Current Page + 1 */}
            {currentPage < totalPages - 1 && (
              <Pagination.Item onClick={() => onPageChange(currentPage + 1)}>
                {currentPage + 1}
              </Pagination.Item>
            )}
            
            {/* Ellipsis if needed */}
            {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
            
            {/* Last Page */}
            <Pagination.Item 
              active={currentPage === totalPages} 
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Pagination.Item>
            
            {/* Next Button */}
            <Pagination.Next 
              onClick={() => onPageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        </div>
      )}
      {/* --- END OF PAGINATION --- */}

    </Container>
  );
};

export default HomePage;