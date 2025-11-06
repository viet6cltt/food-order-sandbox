import React, { createContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../features/auth/api';

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'customer' | 'owner') => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // In a real app, fetch user profile here. We'll decode minimal info if backend returns it in token
      // keeping this simple for now
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await apiLogin({ email, password });
    const t = data.token ?? data.accessToken ?? null;
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
    }
    setUser(data.user ?? null);
  };

  const register = async (name: string, email: string, password: string, role?: 'customer' | 'owner') => {
    const data = await apiRegister({ name, email, password, role });
    const t = data.token ?? data.accessToken ?? null;
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
    }
    setUser(data.user ?? null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
