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
  login: (phone: string, password: string) => Promise<void>;
  register: (username: string, password: string, idToken: string) => Promise<void>;
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

  const login = async (phone: string, password: string) => {
    const data = await apiLogin({ phone, password });
    const t = data.data?.accessToken ?? data.accessToken ?? null;
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
    }
    const userData = data.data?.user ?? data.user ?? null;
    if (userData) {
      setUser({
        id: userData.id ?? String(userData._id),
        name: userData.username,
        email: userData.email,
        role: userData.role,
      });
    }
  };

  const register = async (username: string, password: string, idToken: string) => {
    const data = await apiRegister({ username, password, idToken });
    const t = data.data?.accessToken ?? data.accessToken ?? null;
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
    }
    const userData = data.data?.user ?? data.user ?? null;
    if (userData) {
      setUser({
        id: userData.id ?? String(userData._id),
        name: userData.username,
        email: userData.email,
        role: userData.role,
      });
    }
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
