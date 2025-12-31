// src/pages/PersonDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getPersonDetails, getPersonMovieCredits } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';

const PersonDetailsPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Person Info & Their Movies in parallel
        const [detailsRes, creditsRes] = await Promise.all([
          getPersonDetails(id),
          getPersonMovieCredits(id)
        ]);

        // Handle body parsing if needed (Netlify function wrapper)
        const details = detailsRes.data.body ? JSON.parse(detailsRes.data.body) : detailsRes.data;
        const creditsData = creditsRes.data.body ? JSON.parse(creditsRes.data.body) : creditsRes.data;

        setPerson(details);
        
        // Sort movies by popularity so the best ones show first
        const sortedCast = (creditsData.cast || []).sort((a, b) => b.popularity - a.popularity);
        
        // Remove duplicates and items without posters to keep it clean
        const uniqueCast = sortedCast.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i && v.poster_path);
        
        setCredits(uniqueCast);
      } catch (error) {
        console.error("Error fetching person:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black text-white">
      <Spinner animation="border" variant="light" />
    </div>
  );

  if (!person) return <div className="text-center text-white mt-5">Person not found</div>;

  return (
    <div className="bg-black text-white" style={{ minHeight: '100vh', paddingTop: '40px' }}>
      <Container className="py-5">
        <Row className="mb-5">
          {/* Left Column: Photo */}
          <Col md={4} lg={3} className="text-center text-md-start mb-4">
            <img 
              src={person.profile_path 
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}` 
                : 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={person.name} 
              className="img-fluid rounded shadow-lg"
              style={{ border: '1px solid #333' }}
            />
          </Col>

          {/* Right Column: Info */}
          <Col md={8} lg={9}>
            <h1 className="display-4 fw-bold">{person.name}</h1>
            
            <div className="d-flex gap-3 text-secondary fw-bold mb-4">
              {person.birthday && <span>Born: {person.birthday}</span>}
              {person.place_of_birth && <span>• {person.place_of_birth}</span>}
            </div>

            {person.biography && (
              <div className="mb-4">
                <h4 className="fw-bold border-start border-4 border-danger ps-3 mb-3">Biography</h4>
                <p className="lead" style={{ fontSize: '1rem', lineHeight: '1.7', opacity: 0.9 }}>
                  {person.biography.length > 800 
                    ? `${person.biography.slice(0, 800)}...` 
                    : person.biography}
                </p>
              </div>
            )}
          </Col>
        </Row>

        {/* Known For Section */}
        {credits.length > 0 && (
          <>
            <h3 className="fw-bold border-start border-4 border-danger ps-3 mb-4">Known For</h3>
            <Row>
              {credits.slice(0, 18).map(item => (
                <Col key={item.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
                  <MovieCard item={item} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default PersonDetailsPage;