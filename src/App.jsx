// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AppNavbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import PersonDetailsPage from './pages/PersonDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import DiscoverPage from './pages/DiscoverPage'; // 1. Import DiscoverPage
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] =useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); 
    setTotalPages(1); 
    navigate('/'); 
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1); 
    setTotalPages(1); 
    navigate('/'); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App" data-bs-theme="dark">
      <AppNavbar onSearch={handleSearch} onHomeClick={handleClearSearch} />
      
      <div className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                searchQuery={searchQuery}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
              />
            } 
          />
          <Route 
            path="/movie/:id" 
            element={<MovieDetailsPage />} 
          />
          <Route 
            path="/person/:id" 
            element={<PersonDetailsPage />} 
          />
          <Route 
            path="/favorites" 
            element={<FavoritesPage />} 
          />
          {/* 2. ADD THE NEW ROUTE FOR DISCOVER */}
          <Route 
            path="/discover/genre/:genreId" 
            element={<DiscoverPage />} 
          />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;