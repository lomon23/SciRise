import type { User } from './user_types';

const API_URL = 'http://localhost:8000/api';

export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/user/me/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

export const updateUserProfile = async (formData: FormData): Promise<User> => {
  const response = await fetch(`${API_URL}/user/me/`, {
    method: 'PATCH',
    // Header 'Content-Type': 'multipart/form-data' браузер ставить сам, коли бачить FormData
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};