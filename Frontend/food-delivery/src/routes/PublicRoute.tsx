import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // 1. Chờ cho đến khi AuthContext xác định xong trạng thái người dùng
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  // 2. Nếu đã xác thực (Authenticated) -> Đẩy ra khỏi trang Auth ngay lập tức
  if (isAuthenticated && user) {
    if (user.role === 'restaurant_owner') return <Navigate to="/owner/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    
    // Mặc định về trang chủ cho Customer
    return <Navigate to="/" replace />;
  }

  // 3. Nếu chưa đăng nhập -> Cho phép xem trang Login/Signup
  return <>{children}</>;
};

export default PublicRoute;