import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

let globalLenis = null;

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.09,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  return <>{children}</>;
};

/* ScrollToTop component to reset scroll position on route changes */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately reset window scroll position
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Reset Lenis smooth scroll position if active
    if (globalLenis) {
      globalLenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
};

export default SmoothScroll;
