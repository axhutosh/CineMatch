// src/components/MicroCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MicroCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const isMovie = !!item.title;
    const path = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;
    navigate(path);
  };

  if (!item.poster_path) return null;

  const imageUrl = `https://image.tmdb.org/t/p/w300${item.poster_path}`;

  return (
    <div className="micro-card" onClick={handleClick}>
      <img src={imageUrl} alt={item.title || item.name} loading="lazy" />
    </div>
  );
};

export default MicroCard;