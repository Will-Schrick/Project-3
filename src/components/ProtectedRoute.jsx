// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) return null; // or a spinner while checking auth

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin has full access or user is in allowed roles
  if (role === 'Admin' || allowedRoles.includes(role)) {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
}

export default ProtectedRoute;
