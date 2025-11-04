// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AppNavbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; // 1. Import Footer
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
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
    // 2. The main .App div now controls the layout
    <div className="App">
      <AppNavbar onSearch={handleSearch} onHomeClick={handleClearSearch} />
      
      {/* 3. Wrap Routes in a div to make it grow */}
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
        </Routes>
      </div>
      
      <Footer /> {/* 4. Add the Footer at the bottom */}
    </div>
  );
}

export default App;