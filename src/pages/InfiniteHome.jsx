// src/pages/InfiniteHome.jsx
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { getMassiveWallData } from '../services/tmdbApi';
import MicroCard from '../components/MicroCard';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';

// 1. Rename Component to InfiniteHome
const InfiniteHome = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const viewportRef = useRef(null);
  const wallRef = useRef(null);

  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });

  const [constraints, setConstraints] = useState({ top: 0, bottom: 0 });
  const scrollTimeout = useRef(null); 

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getMassiveWallData();
        setItems(data);
      } catch (error) {
        console.error("Failed to load wall", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useLayoutEffect(() => {
    if (!loading && viewportRef.current && wallRef.current) {
      const viewportHeight = viewportRef.current.offsetHeight;
      const contentHeight = wallRef.current.offsetHeight;
      
      // Calculate boundaries (removed extra buffer for edge-to-edge fit)
      setConstraints({ 
        top: 0, 
        bottom: -(contentHeight - viewportHeight) 
      });
    }
  }, [loading, items]);

  const snapBackToBounds = () => {
    const currentY = y.get();
    if (currentY > constraints.top) {
      animate(y, constraints.top, { type: "spring", stiffness: 200, damping: 20 });
    } else if (currentY < constraints.bottom) {
      animate(y, constraints.bottom, { type: "spring", stiffness: 200, damping: 20 });
    }
  };

  const handleWheel = (e) => {
    y.stop();
    const currentY = y.get();
    let newY = currentY - e.deltaY;

    if (newY > constraints.top) {
      newY = currentY - (e.deltaY * 0.2); 
    } else if (newY < constraints.bottom) {
      newY = currentY - (e.deltaY * 0.2);
    }

    y.set(newY);

    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      snapBackToBounds();
    }, 150); 
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#000' }}>
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div 
      ref={viewportRef}
      className="spatial-container" 
      onWheel={handleWheel}
      // 2. CRITICAL FIX: Force container height so switching works
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000'
      }}
    >
      {/* 3. FIX RED LINE: Used <motion.div> here correctly */}
      <motion.div 
        ref={wallRef}
        className="spatial-grid"
        drag="y" 
        dragConstraints={constraints}
        dragElastic={0.2}
        dragMomentum={true}
        style={{ 
          y: springY, 
          cursor: 'grab', 
          touchAction: 'none',
          padding: 0 // Edge-to-edge fix
        }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {items.map((item, index) => (
          <MicroCard key={`${item.id}-${index}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

// 4. Export with the correct name
export default InfiniteHome;