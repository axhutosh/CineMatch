// src/components/CategoryRow.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard'; // We will re-use our existing MovieCard

// This is a self-contained component.
// It fetches its own data based on the props it receives.
const CategoryRow = ({ title, fetchDataFunction, seeAllLink }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Call the specific fetch function we passed in (e.g., getPopularTvShows)
        const response = await fetchDataFunction(1); // Fetch just page 1 for the row

        // 2. Parse the Netlify Function response
        let tmdbData;
        if (response.data.body) {
          tmdbData = JSON.parse(response.data.body);
        } else {
          tmdbData = response.data;
        }

        setItems(tmdbData.results || []);
      } catch (err) {
        console.error("Failed to fetch category:", title, err);
        setError(`Failed to load ${title}.`);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [title, fetchDataFunction]); // Re-run if the title or fetch function changes

  if (error) {
    // Don't render the whole row if it fails, just show a small error
    return <Alert variant="danger" className="mt-2">{error}</Alert>;
  }

  return (
    <div className="category-row-container mb-4">
      {/* 3. Title and "See All" link */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="mb-0">{title}</h3>
        {seeAllLink && (
          <Link to={seeAllLink} className="btn btn-outline-light btn-sm">
            See All
          </Link>
        )}
      </div>

      {/* 4. Horizontal Scrolling Wrapper */}
      {loading ? (
        <div className="d-flex justify-content-center my-3">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="horizontal-scroll-wrapper">
          <Row className="flex-nowrap g-3">
            {/* Show the first 10 items */}
            {items.slice(0, 10).map((item) => (
              // We adjust the Col size for a horizontal row
              <Col xs={6} sm={4} md={3} lg={2} key={item.id} style={{ minWidth: '200px' }}>
                {/* --- 💡 THE FIX IS HERE --- */}
                {/* Changed prop from 'movie={item}' to 'item={item}' */}
                <MovieCard item={item} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default CategoryRow;