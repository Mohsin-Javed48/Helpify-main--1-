// components/AnimatedRoute.js
import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: -50,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  out: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

const pageTransition = {
  duration: 0.6,
};

function AnimatedRoute({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedRoute;
