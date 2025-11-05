// src/pages/AnimePage.jsx
import React, { useState, useEffect } from 'react';
import { getAnime } from '../services/tmdbApi'; // Changed API function
import { Container, Row, Col, Spinner, Alert, Pagination } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';

const AnimePage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAnime = async () => {
      try {
        setLoading(true);
        const response = await getAnime(currentPage); // Call getAnime
        
        let tmdbData;
        if (response.data.body) {
          tmdbData = JSON.parse(response.data.body);
        } else {
          tmdbData = response.data;
        }

        setShows(tmdbData.results || []);
        setTotalPages(tmdbData.total_pages);
        setError(null);
      } catch (err) {
        setError('Failed to fetch Anime.');
        console.error(err);
        setShows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [currentPage]); // Re-run only when page changes

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
      <h1 className="my-4 text-center">Anime</h1>

      {shows.length > 0 ? (
        <>
          <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
            {shows.map((show) => (
              <MovieCard key={show.id} item={show} />
            ))}
          </Row>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center my-4">
              <Pagination>
                {/* ... (Pagination logic) ... */}
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
        </>
      ) : (
        <Alert variant="info">No Anime found.</Alert>
      )}
    </Container>
  );
};

export default AnimePage;