import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useUser = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useUser must be used within an AuthProvider');
  }

  return {
    user: context.user,
    isLoading: context.isLoading,
    isAuthenticated: context.isAuthenticated,
    getRole: () => context.user?.role || null,
    refetch: context.refreshUser, // Gọi khi user vừa update profile xong
  };
};

export default useUser;