export type UserProfile = {
  id: string;
  username: string;
  email?: string;
  phone: string;
  firstname?: string;
  lastname?: string;
  fullName?: string; // Computed from firstname + lastname, or fallback to username
  avatarUrl?: string;
  dateOfBirth?: string;
  role: 'customer' | 'admin' | 'restaurant_owner';
  status?: 'active' | 'banned' | 'pending';
  phoneVerifiedAt?: string;
  emailVerifiedAt?: string;
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