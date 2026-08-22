import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasAdminToken = localStorage.getItem('adminToken') === 'true';
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

  if (!user && localStorage.getItem('adminToken') !== 'true') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
