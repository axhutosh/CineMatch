// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import hook to read URL query
import { searchMovies } from '../services/tmdbApi'; // Only import searchMovies
import { Container, Row, Col, Spinner, Alert, Pagination } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';

const SearchPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 1. Get the search query from the URL (e.g., /search?q=iron%20man)
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    window.scrollTo(0, 0); 
    
    if (!query) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const fetchMovies = async () => {
      try {
        setLoading(true);
        // 2. Fetch search results based on query and page
        const response = await searchMovies(query, currentPage);
        
        let tmdbData;
        if (response.data.body) {
          tmdbData = JSON.parse(response.data.body);
        } else {
          tmdbData = response.data;
        }
        
        setMovies(tmdbData.results || []);
        setTotalPages(tmdbData.total_pages); 
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results. Please try again later.');
        console.error(err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, currentPage]); // 3. Re-run if query or page changes

  // 4. Reset to page 1 if the query (search term) changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading search results...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="pb-5">
      {/* 5. Dynamic title based on the query */}
      <h1 className="my-4 text-center">Search Results for "{query}"</h1>
      
      {!loading && !error && movies.length === 0 && (
        <Alert variant="info">No movies found for this search.</Alert>
      )}

      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} item={movie} /> 
        ))}
      </Row>

      {/* --- PAGINATION COMPONENT --- */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center my-4">
          <Pagination>
            {/* ... (Pagination logic is identical to MoviesPage) ... */}
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
            />
            <Pagination.Item 
              active={currentPage === 1} 
              onClick={() => handlePageChange(1)}
            >
              1
            </Pagination.Item>
            {currentPage > 3 && <Pagination.Ellipsis disabled />}
            {currentPage > 2 && (
              <Pagination.Item onClick={() => handlePageChange(currentPage - 1)}>
                {currentPage - 1}
              </Pagination.Item>
            )}
            {currentPage !== 1 && currentPage !== totalPages && (
              <Pagination.Item active>{currentPage}</Pagination.Item>
            )}
            {currentPage < totalPages - 1 && (
              <Pagination.Item onClick={() => handlePageChange(currentPage + 1)}>
                {currentPage + 1}
              </Pagination.Item>
            )}
            {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
            <Pagination.Item 
              active={currentPage === totalPages} 
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Pagination.Item>
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default SearchPage;