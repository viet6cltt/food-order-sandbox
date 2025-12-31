import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RoleBasedRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log(user);
    if (isAuthenticated && user) {
      if (user.role === 'restaurant_owner') {
        navigate('/owner/dashboard', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } 
      else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  return <div className="flex justify-center items-center h-screen">Đang chuyển hướng...</div>;
};

export default RoleBasedRedirect;