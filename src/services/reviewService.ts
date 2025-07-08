import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export interface ReviewData {
  serviceRequestId: string;
  technician: string;
  rating: number;
  comment?: string;
}

export interface Review {
  _id: string;
  serviceRequest: string;
  client: {
    _id: string;
    name: string;
    avatar?: string;
  };
  technician: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export const reviewService = {
  createReview: (reviewData: ReviewData) => API.post<Review>('/api/reviews', reviewData),
  getReviewsForTechnician: (technicianId: string) => API.get<Review[]>(`/api/reviews/${technicianId}`),
};
