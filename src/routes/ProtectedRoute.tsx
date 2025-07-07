import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/User';

interface ProtectedRouteProps {
  allowedRoles?: User['type'] | User['type'][];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // Assuming useAuth might have a loading state

  if (loading) {
    // Optionally render a loading spinner or skeleton
    return <div>Cargando...</div>;
  }

  if (!user) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (Array.isArray(allowedRoles) ? !allowedRoles.includes(user.type) : allowedRoles !== user.type)) {
    // User authenticated but not authorized, redirect to a suitable page (e.g., home or unauthorized page)
    // For now, let's redirect to home, but a dedicated unauthorized page would be better
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
