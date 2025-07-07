import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import type { User } from '../types/User';

const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('authToken')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('authToken')}`;
  }
  return req;
});

export interface QuoteRequestData {
  description: string;
  category: string;
  location: string;
}

export interface QuoteRequest {
  _id: string;
  clientId: User; // Changed from string to User
  description: string;
  category: string;
  location: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'rejected';
  quotedPrice?: number;
  technicianId?: User; // Changed from string to User
  createdAt: string;
}

export const quoteRequestService = {
  createQuoteRequest: (data: QuoteRequestData) => API.post<QuoteRequest>('/api/quote-requests', data),
  getQuoteRequests: () => API.get<QuoteRequest[]>('/api/quote-requests'),
  getQuoteRequestById: (id: string) => API.get<QuoteRequest>(`/api/quote-requests/${id}`),
  updateQuoteRequestStatus: (id: string, status: string, quotedPrice?: number) =>
    API.put<QuoteRequest>(`/api/quote-requests/${id}/status`, { status, quotedPrice }),
};
