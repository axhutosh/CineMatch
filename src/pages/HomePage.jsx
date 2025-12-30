// src/pages/HomePage.jsx
import React from 'react';
import InfiniteHome from './InfiniteHome';
import ClassicHome from './ClassicHome';

// Now receives 'viewMode' as a prop from App.jsx
const HomePage = ({ viewMode }) => {
  return (
    <>
      {viewMode === 'infinite' ? <InfiniteHome /> : <ClassicHome />}
    </>
  );
};

export default HomePage;