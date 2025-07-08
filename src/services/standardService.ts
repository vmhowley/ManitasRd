import axios from 'axios';
import { API_BASE_URL } from '../api/config';

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

// --- TYPE DEFINITIONS ---

export interface PriceModifier {
  _id: string;
  name: string;
  additionalCost: number;
}

export interface StandardService {
  _id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  priceModifiers: PriceModifier[];
  isActive: boolean;
}

// --- SERVICE METHODS ---

export const standardService = {
  /**
   * Fetches all active standard services.
   */
  getActiveServices: () => 
    API.get<StandardService[]>('/api/services'),
};
