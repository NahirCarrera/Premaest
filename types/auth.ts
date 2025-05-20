// types/auth.ts
export interface UserData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse {
  success?: boolean;
  error?: string;
  user?: UserData;
}