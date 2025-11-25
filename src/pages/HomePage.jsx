// src/pages/HomePage.jsx
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { getMassiveWallData } from '../services/tmdbApi';
import MicroCard from '../components/MicroCard';
// 1. Import 'animate' helper
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const viewportRef = useRef(null);
  const wallRef = useRef(null);

  // Motion Values
  const y = useMotionValue(0);
  
  // 2. FIX RED LINE: We create the spring, and we MUST use it in the style below
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });

  const [constraints, setConstraints] = useState({ top: 0, bottom: 0 });
  const scrollTimeout = useRef(null); // To track when scrolling stops

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
      // Calculate boundaries
      setConstraints({ 
        top: 0, 
        bottom: -(contentHeight - viewportHeight) 
      });
    }
  }, [loading, items]);

  // 3. FIX SNAP BACK: Logic to bounce back when wheel stops
  const snapBackToBounds = () => {
    const currentY = y.get();
    
    // If pulled past TOP
    if (currentY > constraints.top) {
      animate(y, constraints.top, { type: "spring", stiffness: 200, damping: 20 });
    } 
    // If pulled past BOTTOM
    else if (currentY < constraints.bottom) {
      animate(y, constraints.bottom, { type: "spring", stiffness: 200, damping: 20 });
    }
  };

  const handleWheel = (e) => {
    // Stop any currently running snap-back animations so we can take control
    y.stop();

    const currentY = y.get();
    let newY = currentY - e.deltaY;

    // Add Resistance (The "Pull" Feel)
    if (newY > constraints.top) {
      // We are at top, pulling down. Divide delta to make it hard to pull.
      newY = currentY - (e.deltaY * 0.2); 
    } else if (newY < constraints.bottom) {
      // We are at bottom, pulling up.
      newY = currentY - (e.deltaY * 0.2);
    }

    y.set(newY);

    // 4. Detect when scrolling STOPS to trigger the snap back
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      snapBackToBounds();
    }, 150); // Wait 150ms after last scroll event
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
    >
      <motion.div 
        ref={wallRef}
        className="spatial-grid"
        drag="y" // Allow vertical drag
        dragConstraints={constraints}
        dragElastic={0.2}
        dragMomentum={true}
        
        // 5. FIX RED LINE: Use 'springY' here, not 'y'
        // This applies the smooth physics we defined above
        style={{ y: springY, cursor: 'grab', touchAction: 'none' }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {items.map((item, index) => (
          <MicroCard key={`${item.id}-${index}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

export default HomePage;