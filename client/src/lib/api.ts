import axios from 'axios';
import type { AuthCredentials, AuthResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, 
});

export const loginUser = async (data: AuthCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      
      throw new Error(error.response.data.error || 'Login failed');
    }
    
    throw new Error('Network error');
  }
};

export const signupUser = async (data: AuthCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};

export const logoutUser = async (): Promise<{ message: string }> => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const checkAuth = async (): Promise<AuthResponse> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default api;