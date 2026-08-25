'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SectionHeader = ({ subtitle, title, light = false }: { subtitle: string, title: string, light?: boolean }) => (
  <div className="mb-20">
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex items-center gap-4 mb-4"
    >
      <div className={cn("w-[3px] h-6", light ? "bg-white/30" : "bg-lime")}></div>
      <span className={cn("font-sans text-[11px] font-bold tracking-[5px] uppercase", light ? "text-white/50" : "text-gray-400")}>
        {subtitle}
      </span>
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className={cn("font-space text-5xl md:text-7xl font-bold leading-tight tracking-tighter uppercase", light ? "text-white" : "text-white")}
    >
      {title}
    </motion.h2>
  </div>
);

export const Counter = ({ value, duration = 2, suffix = "" }: { value: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      if (start === end) return;

      let totalMiliseconds = duration * 1000;
      let incrementTime = (totalMiliseconds / end);

      let timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-lime z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};

export const ScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          whileHover={{ scale: 1.1, backgroundColor: "#1a1a1a" }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[60] w-14 h-14 bg-brand-dark text-white rounded-full flex items-center justify-center shadow-2xl transition-colors group"
          aria-label="Scroll to top"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#CCFF00"
              strokeWidth="2"
              style={{ pathLength: scrollYProgress }}
              transition={{ duration: 0.1 }}
            />
          </svg>
          <ArrowUp className="w-5 h-5 group-hover:text-lime transition-colors relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
