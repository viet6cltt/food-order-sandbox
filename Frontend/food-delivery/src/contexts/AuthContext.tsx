/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import api from '../services/apiClient';

export type Provider = {
  provider: 'local' | 'google' | 'firebase';
  providerId?: string;
  emailAtProvider?: string;
  avatarUrl?: string;
};

export type User = {
  id: string;
  username: string;
  phone: string;
  phoneVerifiedAt?: string | null;
  email?: string;
  emailVerifiedAt?: string | null;

  providers: Provider[];

  role: 'customer' | 'restaurant_owner' | 'admin';
  status: 'active' | 'banned' | 'pending';

  // profile info
  firstname?: string;
  lastname?: string;
  avatarUrl?: string;
  dateOfBirth?: string;

  address?: {
    street?: string;
    city?: string;
    geo?: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
  };

  createdAt?: string;
  updatedAt?: string;
};

export type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (username: string, password: string, idToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>; // Để component khác gọi khi cần update profile
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      // Endpoint lấy info user hiện tại
      const res = await api.get('/users/me'); 
      setUser(res.data.data.user);
      console.log(res.data.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = async (phone: string, password: string) => {
    const res = await api.post('/auth/login', { phone, password });
    const { accessToken, user: userData } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(userData);
  };

  const register = async (username: string, password: string, idToken: string) => {
    await api.post('/auth/register', { username, password, idToken });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {/* Trong khi đang kiểm tra token, không render app để tránh nhảy trang */}
      {!isLoading ? children : <div className="loading-spinner">Loading...</div>}
    </AuthContext.Provider>
  );
};