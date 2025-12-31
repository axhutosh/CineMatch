// src/App.jsx
import React, { useState, useEffect } from 'react'; // 👈 Added useEffect
import { Routes, Route, useLocation } from 'react-router-dom';
import AppNavbar from './components/layout/Navbar'; 
import Footer from './components/layout/Footer';

// Page Imports
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchPage from './pages/SearchPage'; 
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import AnimePage from './pages/AnimePage';
import FavoritesPage from './pages/FavoritesPage';
import GenrePage from './pages/GenrePage';
import PersonDetailsPage from './pages/PersonDetailsPage';

function App() {
  // 1. Manage View Mode (Classic vs Infinite)
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('homeViewMode') || 'infinite';
  });
  
  // 2. Route Detection
  const location = useLocation();
  const isHome = location.pathname === '/';

  // ⚡️ FIX: Scroll to Top whenever the URL path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 3. Footer Logic: Fixed ONLY on Home Page when in Infinite Mode
  const isFooterFixed = isHome && viewMode === 'infinite';

  // 4. Handle View Switching
  const handleViewSwitch = (mode) => {
    setViewMode(mode);
    localStorage.setItem('homeViewMode', mode);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container bg-black min-vh-100 text-white d-flex flex-column">
      
      {/* Navbar - Always Fixed at Top */}
      <AppNavbar 
         viewMode={viewMode} 
         onViewSwitch={handleViewSwitch} 
      />
      
      {/* Main Content Wrapper */}
      <div 
        className="flex-grow-1"
        style={{ paddingTop: isHome ? '0' : '90px' }} 
      >
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage viewMode={viewMode} />} />
          
          {/* Details Pages */}
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/tv/:id" element={<MovieDetailsPage />} />
          
          {/* Person / Cast Details Page */}
          <Route path="/person/:id" element={<PersonDetailsPage />} />
          
          {/* Genre Page */}
          <Route path="/genre/:type/:id/:name" element={<GenrePage />} />

          {/* Other Pages */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TVShowsPage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer isFixed={isFooterFixed} />
    </div>
  );
}

export default App;