// auth.service.ts
import type { RegisterRequest , RegisterResponse, LoginRequest, LoginResponse } from './auth_types';

const API_URL = 'http://localhost:8000/api';

export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data: RegisterResponse = await response.json();

    if (!response.ok) {
      // Якщо сервер повернув помилку (наприклад 400), викидаємо її
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error: any) {
    // Прокидаємо помилку далі, щоб компонент її обробив
    throw new Error(error.message || 'Network error');
  }
};


export const loginUser = async (creds: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Цей параметр дозволяє браузеру зберегти Session Cookie від Django
      credentials: 'include', 
      body: JSON.stringify(creds),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
};