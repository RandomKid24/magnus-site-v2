'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ExternalLink } from 'lucide-react';
import type { PublicNavigationItem } from '@/lib/cms/navigation';

const DEFAULT_ITEMS = ['Products', 'Solutions', 'Fleet', 'Gallery', 'About', 'Contact'];

export default function Navbar({
  scrollToId,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  items,
}: {
  scrollToId: (e: React.MouseEvent, id: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** CMS-driven navigation; falls back to the original anchor menu. */
  items?: PublicNavigationItem[];
}) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('');

  // Normalize CMS items into render targets (anchor ids or plain URLs).
  const navTargets = React.useMemo(() => {
    if (!items || items.length === 0) {
      return DEFAULT_ITEMS.map((label) => ({
        label,
        id: label.toLowerCase().replace(' ', '-'),
        url: `#${label.toLowerCase().replace(' ', '-')}`,
        external: false,
        newTab: false,
      }));
    }
    return items.map((item) => {
      const isAnchor = item.url.startsWith('#');
      return {
        label: item.label,
        id: isAnchor ? item.url.slice(1) : '',
        url: item.url,
        external: !isAnchor && /^https?:\/\//i.test(item.url),
        newTab: item.opensInNewTab,
      };
    });
  }, [items]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const sections = ['home', ...navTargets.map((t) => t.id).filter(Boolean)];
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [navTargets]);

  const renderItem = (
    target: (typeof navTargets)[number],
    classNameActive: string,
    classNameInactive: string
  ) => {
    const isActive = target.id !== '' && activeSection === target.id;
    const handleClick = (e: React.MouseEvent) => {
      if (target.id) {
        scrollToId(e, target.id);
      }
      // Non-anchor links navigate natively.
    };

    return (
      <>
        <motion.a
          key={target.label}
          whileHover={{ y: -2 }}
          href={target.url}
          target={target.newTab || target.external ? '_blank' : undefined}
          rel={target.newTab || target.external ? 'noopener noreferrer' : undefined}
          className={`text-[11px] font-bold tracking-[3px] uppercase transition-colors duration-500 font-sans ${
            isActive ? classNameActive : classNameInactive
          }`}
          onClick={handleClick}
        >
          {target.label}
        </motion.a>
        {isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            className={`absolute bottom-0 left-0 right-0 h-[2px] ${isScrolled ? 'bg-lime-dark' : 'bg-lime'}`}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </>
    );
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] h-[100px] border-b transition-all duration-500 ${
          isScrolled 
            ? 'border-white/10 bg-black/95 backdrop-blur-md' 
            : 'border-white/10 bg-transparent'
        }`}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 flex items-center justify-center relative group cursor-pointer">
            <img src="/logo.png" alt="Magnus Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col -space-y-1.5">
            <span className={`font-space text-2xl font-bold tracking-tighter uppercase transition-colors duration-500 ${isScrolled ? 'text-white' : 'text-white'}`}>
              Magnus
            </span>
            <span className="font-sans text-[8px] font-bold tracking-[4px] uppercase text-lime">
              Enterprises <span className={`transition-colors duration-500 ${isScrolled ? 'text-white' : 'text-white'}`}>.</span>
            </span>
          </div>
        </motion.div>
        
        <ul className="hidden lg:flex gap-8 xl:gap-12 list-none">
          {navTargets.map((target) => (
            <li key={target.label} className="relative py-2">
              {renderItem(
                target,
                isScrolled ? 'text-lime-dark' : 'text-lime',
                isScrolled ? 'text-white hover:text-lime-dark' : 'text-white/70 hover:text-lime'
              )}
            </li>
          ))}
        </ul>

        <button className={`lg:hidden p-2 transition-colors duration-500 ${isScrolled ? 'text-white' : 'text-white'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-start lg:justify-center overflow-y-auto space-y-8 lg:space-y-12 p-10 py-24"
          >
            <button className="absolute top-10 right-10 text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={32} />
            </button>
            {navTargets.map((target) => (
              <motion.a 
                key={target.label} 
                whileHover={{ scale: 1.1, color: "#CCFF00" }}
                whileTap={{ scale: 0.9 }}
                href={target.url}
                target={target.newTab || target.external ? '_blank' : undefined}
                rel={target.newTab || target.external ? 'noopener noreferrer' : undefined}
                className="font-space text-4xl font-bold text-white transition-colors uppercase inline-flex items-center gap-3"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (target.id) scrollToId(e, target.id);
                }}
              >
                {target.label}
                {(target.external || target.newTab) && <ExternalLink size={20} className="opacity-50" />}
              </motion.a>
            ))}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                scrollToId(e, 'contact');
              }}
              className="btn-primary-custom !bg-lime !text-black mt-10"
            >
              Get Started
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
