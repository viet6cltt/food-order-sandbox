import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';

const RoleBasedRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === 'restaurant_owner') {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  return <div className="flex justify-center items-center h-screen">Đang chuyển hướng...</div>;
};

export default RoleBasedRedirect;