// src/pages/GenrePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getMoviesByGenreId, getTvShowsByGenreId } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';

const GenrePage = () => {
  const { type, id, name } = useParams(); // URL params: /genre/:type/:id/:name
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchFunc = type === 'tv' ? getTvShowsByGenreId : getMoviesByGenreId;
        const res = await fetchFunc(id);
        const data = res.data.body ? JSON.parse(res.data.body) : res.data;
        setItems(data.results || []);
      } catch (error) {
        console.error("Error fetching genre:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  return (
    <Container className="py-5" style={{ minHeight: '100vh' }}>
      <h2 className="text-white mb-4 fw-bold border-start border-4 border-danger ps-3">
        {name} {type === 'tv' ? 'TV Shows' : 'Movies'}
      </h2>

      {loading ? (
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        <Row>
          {items.map(item => (
             <Col key={item.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
               <MovieCard item={item} />
             </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default GenrePage;