import React, { createContext, useState, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister } from '../features/auth/api';

export type User = {
  id: string;
  username: string;
  phone: string;
  role: string;
  avatarUrl?: string;
  address?: { street: string; city: string; geo: [number, number] };
  firstname?: string;
  lastname?: string;
};

export type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (username: string, password: string, idToken: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (phone: string, password: string) => {
    const res = await apiLogin({ phone, password });
    const token = res.data?.accessToken ?? null;
    if (!token) throw new Error('Access token missing');

    setAccessToken(token);

    const userData = res.data?.user;
    if (!userData) throw new Error('User data missing');

    setUser({
      id: userData.id,
      username: userData.username,
      phone: userData.phone,
      role: userData.role ?? 'customer',
      avatarUrl: userData.avatarUrl,
      firstname: userData.firstname,
      lastname: userData.lastname,
      address: userData.address,
    });
  };

  const register = async (username: string, password: string, idToken: string) => {
    await apiRegister({ username, password, idToken });
    // Chỉ trả về success, không set token hay user
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};