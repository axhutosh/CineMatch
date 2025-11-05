// src/App.jsx
import React from 'react'; // Removed useState
import { Routes, Route, useNavigate } from 'react-router-dom';
import AppNavbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage'; // This is our new Dashboard
import MovieDetailsPage from './pages/MovieDetailsPage';
import PersonDetailsPage from './pages/PersonDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import DiscoverPage from './pages/DiscoverPage';
import MoviesPage from './pages/MoviesPage'; // 1. Import new pages
import TVShowsPage from './pages/TVShowsPage';
import SearchPage from './pages/SearchPage';
import AnimePage from './pages/AnimePage';
import './App.css';

function App() {
  // 2. All state (searchQuery, currentPage, etc.) is REMOVED.
  // Pages now manage their own state.
  
  const navigate = useNavigate();

  // 3. handleSearch is now much simpler.
  // It just navigates to the SearchPage with a query parameter.
  const handleSearch = (query) => {
    if (query) {
      navigate(`/search?q=${query}`);
    }
  };
  
  // 4. handleClearSearch now just navigates home.
  const handleClearSearch = () => {
    navigate('/'); 
  };

  // 5. handlePageChange is REMOVED (no longer needed here).

  return (
    <div className="App" data-bs-theme="dark">
      <AppNavbar onSearch={handleSearch} onHomeClick={handleClearSearch} />
      
      <div className="main-content">
        {/* 6. Routes are updated */}
        <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<HomePage />} />
          
          {/* "See All" Pages */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TVShowsPage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Details Pages */}
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/tv/:id" element={<MovieDetailsPage />} /> {/* 7. Add route for TV details */}
          <Route path="/person/:id" element={<PersonDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/discover/genre/:genreId" element={<DiscoverPage />} />
          
          {/* We can add Top Rated / Upcoming routes later */}
          {/* <Route path="/top-rated" element={<... />} /> */}
          {/* <Route path="/upcoming" element={<... />} /> */}
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;