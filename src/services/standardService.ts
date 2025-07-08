import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import type { Service } from '../types/ServiceRequest'; // Importar la interfaz Service

// Base Axios instance
const API = axios.create({ baseURL: API_BASE_URL });

// Interceptor to add the auth token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- SERVICE METHODS ---

export const standardService = {
  /**
   * Fetches all active standard services.
   */
  getAllServices: () => 
    API.get<Service[]>('/api/services'),
};

