// src/hooks/useUser.ts
import { useState, useEffect } from 'react';
import { getUserProfile } from '../features/profile/api';
import { type UserProfile } from '../types/user';
import useAuth from './useAuth';

export const useUser = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  const getRole = () => {
    return user?.role || null;
  };

  return { user, loading, error, refetch: () => {}, getRole };
};

export default useUser;