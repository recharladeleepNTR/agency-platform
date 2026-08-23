import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Clapperboard } from 'lucide-react';

const navLinks = [
  { to: '/',          label: 'Home'      },
  { to: '/services',  label: 'Services'  },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about',     label: 'About'     },
  { to: '/contact',   label: 'Contact'   },
];

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const location                    = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change & toggle body overflow on mobile menu toggle
  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  };

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-lazyBg/90 backdrop-blur-xl border-b border-lazyAccent/10 shadow-[0_2px_40px_rgba(14,0,20,0.6)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-5 sm:px-8 h-20 md:h-24 flex items-center justify-between">

          {/* Left — Logo */}
          <Link to="/" className="flex items-center gap-2.5 justify-self-start">
            <motion.img
              src="/lazydition_logo.png"
              alt="Lazydition Logo"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="w-11 h-11 object-contain"
            />
            <span className="text-2xl font-extrabold tracking-tight text-white">
              lazydition
            </span>
          </Link>

          {/* Centre — Nav links */}
          <div className="hidden md:flex items-center justify-center gap-1">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-5 py-2.5 text-base font-medium rounded-lg transition-colors duration-200 ${
                    active
                      ? 'text-lazyAccent'
                      : 'text-lazyText/55 hover:text-lazyText'
                  }`}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-lazyAccent"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right — CTA + Mobile toggle */}
          <div className="flex items-center justify-end">
            {location.pathname !== '/contact' && (
              <div className="hidden md:block">
                <Link
                  to="/contact"
                  id="navbar-cta"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white text-base font-bold px-7 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_24px_rgba(148,148,255,0.4)] hover:scale-105"
                >
                  Start a Project
                </Link>
              </div>
            )}
            {/* Mobile Toggle */}
            <button
              id="navbar-mobile-toggle"
              className="md:hidden p-2 text-lazyText/70 hover:text-lazyText transition-colors touch-manipulation cursor-pointer"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-20 z-40 bg-lazyBg/95 backdrop-blur-xl border-b border-lazyAccent/10 px-6 py-6 flex flex-col gap-2 md:hidden max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-lazyAccent bg-lazyAccent/10'
                    : 'text-lazyText/70 hover:text-lazyText hover:bg-lazyAccent/5'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-2 w-full text-center bg-gradient-to-r from-lazyAccent to-lazyDeep text-white font-bold py-3 rounded-xl"
            >
              Start a Project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
