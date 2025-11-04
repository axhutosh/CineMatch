// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrendingMovies, searchMovies } from '../services/tmdbApi';
import { Container, Row, Col, Spinner, Alert, Pagination } from 'react-bootstrap'; // 1. Import Pagination
import MovieCard from '../components/MovieCard';

const HomePage = ({ 
  searchQuery, 
  currentPage, // 2. Accept new props
  onPageChange, 
  totalPages,
  setTotalPages 
}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when page or query changes
    window.scrollTo(0, 0); 
    
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = searchQuery
          ? await searchMovies(searchQuery, currentPage) // 3. Pass currentPage
          : await getTrendingMovies(currentPage); // 3. Pass currentPage
        
        setMovies(response.data.results);
        // 4. Set total pages from the API response
        setTotalPages(response.data.total_pages); 
        setError(null);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, currentPage, setTotalPages]); // 5. Add dependencies

  const title = searchQuery ? `Search Results for "${searchQuery}"` : 'Trending This Week';

  if (loading) {
    // ... (loading spinner)
  }
  if (error) {
    // ... (error message)
  }

  return (
    <Container>
      <h1 className="my-4 text-center">{title}</h1>
      
      {/* ... (no results message) ... */}

      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Row>

      {/* --- 6. ADD PAGINATION COMPONENT --- */}
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