'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';

export default function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  useEffect(() => {
    // Simple timer to transition away after 2 seconds
    const timer = setTimeout(onFinished, 2000);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-56 h-56 mb-12"
        >
          <img 
            src="/logo.png" 
            alt="Magnus Logo" 
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Name */}
        <div className="flex flex-col items-center -space-y-1">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-space text-4xl font-bold tracking-tighter text-white uppercase"
          >
            Magnus
          </motion.span>
          <motion.span 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-lime"
          >
            Enterprises
          </motion.span>
        </div>
      </div>

      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grain"></div>
      </div>
    </motion.div>
  );
}
