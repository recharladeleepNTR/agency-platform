import { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import SmoothScroll, { ScrollToTop } from './components/SmoothScroll';

import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function App() {
  useEffect(() => {
    // Prevent right-click / contextmenu on images, videos, logos, and graphics
    const handleContextMenu = (e) => {
      const tag = e.target.tagName;
      if (
        tag === 'IMG' ||
        tag === 'VIDEO' ||
        tag === 'CANVAS' ||
        tag === 'PICTURE' ||
        e.target.closest('img') ||
        e.target.closest('video') ||
        e.target.closest('.protected-asset')
      ) {
        e.preventDefault();
      }
    };

    // Prevent dragging images or videos
    const handleDragStart = (e) => {
      const tag = e.target.tagName;
      if (
        tag === 'IMG' ||
        tag === 'VIDEO' ||
        e.target.closest('img') ||
        e.target.closest('video')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);
  return (
    <Router>
      <SmoothScroll>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col font-sans bg-lazyBg text-lazyText selection:bg-lazyAccent/30 selection:text-lazyText">
          <Navbar />
          <main className="flex-grow pt-24">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </Router>
  );
}

export default App;
