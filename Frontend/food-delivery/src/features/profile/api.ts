import apiClient from '../../services/apiClient';
import { type UserProfile } from '../../types/user';

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/users/me');
  return response.data.data.user;
};

export const updateUserProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await apiClient.put('/users/me', data);
  return response.data.data.updatedUser;
};