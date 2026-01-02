import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Public-only route: if user is already authenticated, redirect away.
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If an access token exists but `useAuth` hasn't resolved yet, forward to /redirect
  if (token) {
    return <Navigate to="/redirect" replace />;
  }

  if (user) {
    if (user.role === 'restaurant_owner') return <Navigate to="/owner/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;

    return <Navigate to="/" replace />;
  }

  // chưa có user thì vào login/signup
  return <>{children}</>
};

export default PublicRoute;
