// types.ts

export interface RegisterRequest {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message?: string;
  user_id?: number;
  error?: string;
}

export interface LoginRequest {
  identifier: string; // Це може бути email або username
  password: string;
}

export interface LoginResponse {
  message?: string;
  error?: string;
}