import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquarePlus } from 'lucide-react';
import { useState, useEffect } from 'react';

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Don't show on contact, login, or admin pages
  const isContact = ['/contact', '/login', '/admin'].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isContact) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Link
            to="/contact"
            id="floating-cta-btn"
            className="flex items-center gap-2.5 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white font-bold text-sm px-5 py-3.5 rounded-full shadow-[0_0_30px_rgba(148,148,255,0.45)] hover:shadow-[0_0_48px_rgba(148,148,255,0.65)] transition-all duration-300 hover:scale-105"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Start a Project
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
