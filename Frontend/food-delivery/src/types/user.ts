// src/types/user.ts
export type UserProfile = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'restaurant_owner' | 'admin';
  avatarUrl?: string;
};