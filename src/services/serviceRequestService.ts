import axios from 'axios';
import type { ServiceRequest } from '../types/ServiceRequest';
import { API_BASE_URL } from '../api/config';

const API = axios.create({ baseURL: `${API_BASE_URL}/api/solicitudes` });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export interface ServiceRequestData {
  category: string;
  description: string;
  address: string;
  requestDate: string;
  preferredTime?: string;
  urgency: string;
  clientBudget?: number;
}

// Data for creating a standard, fixed-price service request
export interface StandardServiceRequestData {
  category: string;
  description: string;
  address: string;
  requestDate: string;
  finalPrice: number;
  serviceId: string;
}

export const serviceRequestService = {
  // Create a new standard service request
  createStandardRequest: (data: StandardServiceRequestData) => 
    API.post<ServiceRequest>('/', data),

  // (The original function can be kept for other purposes or deprecated)
  submitServiceRequest: (requestData: ServiceRequestData, userId: string) => 
    API.post<ServiceRequest>('/', { ...requestData, clientId: userId }),

  // Get all requests for the logged-in user
  getRequests: () => API.get<ServiceRequest[]>('/'),

  // Get available requests for technicians
  getAvailableRequests: () => API.get<ServiceRequest[]>('/disponibles'),

  // Accept a request
  acceptRequest: (requestId: string) => 
    API.post<ServiceRequest>(`/${requestId}/aceptar`, {}),

  // Get a request by ID
  getRequestById: (id: string) => API.get<ServiceRequest>(`/${id}`),

  // Cancel a request
  cancelRequest: (requestId: string) => 
    API.put<ServiceRequest>(`/${requestId}/cancelar`, {}),

  // Complete a request
  completeRequest: (requestId: string) => 
    API.put<ServiceRequest>(`/${requestId}/completar`, {}),
};