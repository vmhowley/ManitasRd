import { api } from '../api/config';
import type { ServiceRequest } from '../types/ServiceRequest';

const API_URL = '/solicitudes';

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
  createStandardRequest: async (data: StandardServiceRequestData) => {
    try {

      const response = await api.post<ServiceRequest>(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error creating standard request:', error);
      throw error;
    }
  },

  // (The original function can be kept for other purposes or deprecated)
  submitServiceRequest: async (requestData: ServiceRequestData, userId: string) => {
    try {

      const response = await api.post<ServiceRequest>(API_URL, { ...requestData, clientId: userId });
      return response.data;
    } catch (error) {
      console.error('Error submitting service request:', error);
      throw error;
    }
  },

  // Get all requests for the logged-in user
  getRequests: async () => {
    try {

      const response = await api.get<ServiceRequest[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  },

  // Get available requests for technicians
  getAvailableRequests: async () => {
    try {

      const response = await api.get<ServiceRequest[]>(`${API_URL}/disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available requests:', error);
      throw error;
    }
  },

  // Accept a request
  acceptRequest: async (requestId: string) => {
    try {

      const response = await api.post<ServiceRequest>(`${API_URL}/${requestId}/aceptar`, {});
      return response.data;
    } catch (error) {
      console.error('Error accepting request:', error);
      throw error;
    }
  },

  // Get a request by ID
  getRequestById: async (id: string) => {
    try {

      const response = await api.get<ServiceRequest>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching request by ID:', error);
      throw error;
    }
  },

  // Cancel a request
  cancelRequest: async (requestId: string) => {
    try {

      const response = await api.put<ServiceRequest>(`${API_URL}/${requestId}/cancelar`, {});
      return response.data;
    } catch (error) {
      console.error('Error canceling request:', error);
      throw error;
    }
  },

  // Complete a request
  completeRequest: async (requestId: string) => {
    try {

      const response = await api.put<ServiceRequest>(`${API_URL}/${requestId}/completar`, {});
      return response.data;
    } catch (error) {
      console.error('Error completing request:', error);
      throw error;
    }
  },
};