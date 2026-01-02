import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectTo = '/auth/login'
}) => {
  const { isAuthenticated } = useAuth();
  const { user, isLoading } = useUser();

  // Đang load user info
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Chưa đăng nhập
  if (!isAuthenticated && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect về trang phù hợp với role
    if (user.role === 'restaurant_owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;