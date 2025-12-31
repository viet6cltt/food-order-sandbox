import apiClient from '../../services/apiClient';

export type UpdateUserPayload = {
  firstname?: string;
  lastname?: string;
  email?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  address?: {
    street?: string;
    city?: string;
    geo?: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
};

export type UserResponse = {
  id: string;
  username: string;
  phone: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  role: 'customer' | 'admin' | 'restaurant_owner';
  status: 'active' | 'banned' | 'pending';
  phoneVerifiedAt?: string;
  emailVerifiedAt?: string;
  address?: {
    street?: string;
    city?: string;
    geo?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Get current user information
 * @returns User data
 */
export async function getMe(): Promise<UserResponse> {
  const res = await apiClient.get('/users/me');
  const user = res.data?.data?.user ?? res.data?.user;
  
  // Normalize id field
  if (user) {
    user.id = user.id || (user._id ? String(user._id) : '');
  }
  
  return user;
}

/**
 * Update current user information
 * @param payload User data to update
 * @returns Updated user data
 */
export async function updateMe(payload: UpdateUserPayload): Promise<UserResponse> {
  const res = await apiClient.put('/users/me', payload);
  const user = res.data?.data?.updatedUser ?? res.data?.data?.user ?? res.data?.user;
  
  // Normalize id field
  if (user) {
    user.id = user.id || (user._id ? String(user._id) : '');
  }
  
  return user;
}

/**
 * Get user information by ID (for admin)
 * @param userId User ID
 * @returns User data
 */
export async function getUser(userId: string): Promise<UserResponse> {
  const res = await apiClient.get(`/users/${userId}`);
  const user = res.data?.data?.user ?? res.data?.user;
  
  // Normalize id field
  if (user) {
    user.id = user.id || (user._id ? String(user._id) : '');
  }
  
  return user;
}

