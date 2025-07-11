import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import type { User, TechnicianUpdatePayload } from '../types/User';

const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const userService = {
  getTechnicians: async (): Promise<User[]> => {
    const response = await API.get('/api/technicians');
    return response.data;
  },

  updateUser: async (userId: string, userData: Partial<User> | TechnicianUpdatePayload): Promise<User> => {
    const response = await API.put(`/api/users/${userId}`, userData);
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await API.get(`/api/users/${userId}`);
    return response.data;
  },
};