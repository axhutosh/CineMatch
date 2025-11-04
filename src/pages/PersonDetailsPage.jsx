// src/pages/PersonDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPersonDetails, getPersonMovieCredits } from '../services/tmdbApi';
// 1. Import Container
import { Container, Row, Col, Image, Spinner, Alert } from 'react-bootstrap';
import MovieCard from '../components/MovieCard'; // Re-use our MovieCard!

const PersonDetailsPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPersonData = async () => {
      try {
        setLoading(true);

        const [personResponse, creditsResponse] = await Promise.all([
          getPersonDetails(id),
          getPersonMovieCredits(id),
        ]);

        // Helper to parse responses (handles 'body' in dev)
        const parseData = (res) => (res.data.body ? JSON.parse(res.data.body) : res.data);

        const personData = parseData(personResponse);
        const creditsData = parseData(creditsResponse);

        setPerson(personData);

        // Sort movies by popularity and get the top 10
        const sortedMovies = (creditsData.cast || [])
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10);
        setMovies(sortedMovies);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch actor details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [id]);

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

  if (!person) return null;

  const getImageUrl = (path, size = "w500") => `https://image.tmdb.org/t/p/${size}${path}`;

  return (
    // 2. Wrap everything in a <Container> and add padding-bottom
    <Container className="mt-5 pb-5"> {/* <-- 💡 FIX APPLIED HERE */}
      <Row>
        <Col md={4} className="text-center text-md-start">
          <Image 
            src={person.profile_path ? getImageUrl(person.profile_path) : 'https://via.placeholder.com/500x750.png?text=No+Image'} 
            fluid 
            rounded 
          />
        </Col>
        <Col md={8}>
          <h2>{person.name}</h2>
          <p><strong>Born:</strong> {person.birthday || 'N/A'}</p>
          <p><strong>Place of Birth:</strong> {person.place_of_birth || 'N/A'}</p>
          <hr />
          <h5>Biography</h5>
          <p>{person.biography || 'No biography available.'}</p>
        </Col>
      </Row>

      {/* --- Known For Section --- */}
      <hr className="my-5" />
      <h3 className="mb-4">Known For</h3>
      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {movies.map((movie) => (
          <MovieCard key={movie.credit_id} movie={movie} />
        ))}
      </Row>
    </Container>
  );
};

export default PersonDetailsPage;