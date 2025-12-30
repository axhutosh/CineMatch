// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/layout/Navbar'; // Ensure this path matches your folder
import Footer from './components/layout/Footer';

// 1. IMPORT YOUR PAGES
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchResultsPage from './pages/SearchPage'; // 👈 We will create this in Step 2

// If you have these pages, uncomment them:
// import MoviesPage from './pages/MoviesPage';
// import TVShowsPage from './pages/TVShowsPage';

function App() {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('homeViewMode') || 'infinite';
  });

  const handleViewSwitch = (mode) => {
    setViewMode(mode);
    localStorage.setItem('homeViewMode', mode);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container bg-black min-vh-100 text-white">
      {/* Navbar controls the View Mode */}
      <AppNavbar 
         viewMode={viewMode} 
         onViewSwitch={handleViewSwitch} 
      />
      
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage viewMode={viewMode} />} />
        
        {/* Movie Details */}
        <Route path="/movie/:id" element={<MovieDetailsPage />} />

        {/* 🔍 SEARCH ROUTE (This fixes the blank search page) */}
        <Route path="/search" element={<SearchResultsPage />} />

        {/* Placeholders for other links - prevents crashing if files don't exist */}
        <Route path="/movies" element={<h1 className="pt-5 mt-5 text-center">Movies Page Coming Soon</h1>} />
        <Route path="/tv" element={<h1 className="pt-5 mt-5 text-center">TV Shows Page Coming Soon</h1>} />
        <Route path="/anime" element={<h1 className="pt-5 mt-5 text-center">Anime Page Coming Soon</h1>} />
        <Route path="/favorites" element={<h1 className="pt-5 mt-5 text-center">My List Coming Soon</h1>} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;