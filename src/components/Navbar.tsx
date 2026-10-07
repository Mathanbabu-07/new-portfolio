import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { navItems, profile } from '../data/portfolio';
import { useScrollSpy } from '../hooks/useScrollSpy';

export const SunburstIcon = ({ className = "w-6 h-6 text-white" }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Sunburst logo"
  >
    {/* 16-point geometric sunburst */}
    <path d="M12 0.5L13.7 8.3L20.1 3.9L16.7 11.2L23.5 12L16.7 12.8L20.1 20.1L13.7 15.7L12 23.5L10.3 15.7L3.9 20.1L7.3 12.8L0.5 12L7.3 11.2L3.9 3.9L10.3 8.3L12 0.5Z" />
  </svg>
);

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const activeId = useScrollSpy(navItems.map((item) => item.id), 'home');

  // Track scroll position to update sticky glass styling
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileMenuOpen]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-4 pointer-events-none">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto pointer-events-auto"
      >
        {/* Floating Glass Bar */}
        <div
          className={`relative transition-all duration-300 ease-out border overflow-hidden ${
            mobileMenuOpen ? 'rounded-2xl' : 'rounded-full'
          } ${
            isScrolled
              ? 'bg-black/55 backdrop-blur-2xl border-white/[0.14] py-2 px-4 sm:px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.5)]'
              : 'bg-white/[0.04] backdrop-blur-xl backdrop-saturate-150 border-white/10 py-3 px-5 sm:px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.35)]'
          }`}
        >
          <nav className="flex items-center justify-between gap-4">
            {/* Left: Sunburst Icon + Wordmark */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className="flex items-center gap-2.5 group transition-transform hover:scale-105 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full"
              aria-label="Mathan Babu S Home"
            >
              <SunburstIcon className="w-6 h-6 text-white transition-transform group-hover:rotate-12 duration-300 flex-shrink-0" />
              <span className="hidden sm:inline font-instrument-sans text-sm font-semibold text-white tracking-tight">
                Mathan Babu S
              </span>
            </a>

            {/* Center: Navigation Links (desktop >= lg) */}
            <div className="hidden lg:flex items-center gap-1 font-instrument-sans text-sm font-medium">
              {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`relative px-3 xl:px-3.5 py-2 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 bg-white/10 border border-white/15 rounded-full pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 sm:gap-4 font-instrument-sans">
              <a
                href={profile.resume.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:block text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 px-3 py-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {profile.resume.label}
              </a>

              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="bg-white text-black rounded-full px-5 py-2.5 font-semibold text-sm hover:bg-neutral-100 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black whitespace-nowrap"
              >
                Hire Me
              </a>

              {/* Mobile Hamburger toggle (< lg) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-2 text-white/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0, scale: mobileMenuOpen ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                </motion.div>
              </button>
            </div>
          </nav>

          {/* 2px Scroll progress indicator at the bottom edge */}
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3054ff] to-[#b4c0ff] origin-left pointer-events-none"
          />
        </div>

        {/* Mobile dropdown menu (< lg) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden mt-2 p-3 sm:p-4 rounded-3xl bg-black/85 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col gap-1.5 overflow-hidden"
            >
              {navItems.map((item, idx) => {
                const isActive = activeId === item.id;
                return (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.22 }}
                    className={`px-4 py-2.5 rounded-xl font-instrument-sans text-sm sm:text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                      isActive
                        ? 'bg-white/10 text-white font-medium border border-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </motion.a>
                );
              })}

              <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between px-3">
                <a
                  href={profile.resume.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white text-sm font-medium py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {profile.resume.label}
                </a>
                <span className="text-xs text-white/50">{profile.status}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
};
