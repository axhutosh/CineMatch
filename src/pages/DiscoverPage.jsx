// src/pages/DiscoverPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getMoviesByGenre } from '../services/tmdbApi';
import { Container, Row, Col, Spinner, Alert, Pagination } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';

// Helper component to show a dynamic pagination
const AppPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center my-4">
      <Pagination>
        <Pagination.Prev 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1} 
        />
        <Pagination.Item active>{currentPage}</Pagination.Item>
        <Pagination.Next 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages} 
        />
      </Pagination>
    </div>
  );
};

const DiscoverPage = () => {
  const { genreId } = useParams(); // Get genre ID from URL
  const location = useLocation(); // Get location to read state
  
  // Get genreName passed from the Link state (see MovieDetailsPage update)
  const genreName = location.state?.genreName || 'Discover';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getMoviesByGenre(genreId, currentPage);

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
        setError('Failed to fetch movies.');
        console.error(err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genreId, currentPage]); // Re-fetch if genre or page changes

  // Reset to page 1 if the genre changes
  useEffect(() => {
    setCurrentPage(1);
  }, [genreId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
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
    <Container className="mt-5 pb-5">
      <h1 className="my-4 text-center">{genreName} Movies</h1>

      {movies.length > 0 ? (
        <>
          <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </Row>
          <AppPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <Alert variant="info">No movies found for this genre.</Alert>
      )}
    </Container>
  );
};

export default DiscoverPage;