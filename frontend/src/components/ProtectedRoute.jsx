import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const hasAdminToken = Boolean(token && token !== 'false');
    if (hasAdminToken) {
      setUser({ role: 'admin' });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingSpinner />;

  const token = localStorage.getItem('adminToken');
  const hasAdminToken = Boolean(token && token !== 'false');

  if (!user && !hasAdminToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
