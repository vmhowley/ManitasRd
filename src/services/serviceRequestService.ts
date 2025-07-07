import axios from 'axios';
import type { ServiceRequest } from '../types/ServiceRequest';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ServiceRequestData {
  category: string;
  description: string;
  address: string;
  requestDate: string;
  preferredTime?: string;
  urgency: string;
  clientBudget?: number;
}

export const serviceRequestService = {
  // Crear una nueva solicitud
  submitServiceRequest: async (
    requestData: ServiceRequestData,
    userId: string
  ): Promise<ServiceRequest> => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${API_BASE_URL}/solicitudes`,
      { ...requestData, clientId: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Obtener todas las solicitudes para el usuario logueado
  getRequests: async (): Promise<ServiceRequest[]> => {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(`${API_BASE_URL}/solicitudes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // Obtener solicitudes disponibles para técnicos
  getAvailableRequests: async (): Promise<ServiceRequest[]> => {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(`${API_BASE_URL}/solicitudes/disponibles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // Aceptar una solicitud
  acceptRequest: async (requestId: string): Promise<ServiceRequest> => {
    const token = localStorage.getItem('authToken');
    const res = await axios.post(
      `${API_BASE_URL}/solicitudes/${requestId}/aceptar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  // Obtener una solicitud por ID
  getRequestById: async (id: string): Promise<ServiceRequest> => {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(`${API_BASE_URL}/solicitudes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // Cancelar una solicitud
  cancelRequest: async (requestId: string): Promise<ServiceRequest> => {
    const token = localStorage.getItem('authToken');
    const res = await axios.put(
      `${API_BASE_URL}/solicitudes/${requestId}/cancelar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  // Completar una solicitud
  completeRequest: async (requestId: string): Promise<ServiceRequest> => {
    const token = localStorage.getItem('authToken');
    const res = await axios.put(
      `${API_BASE_URL}/solicitudes/${requestId}/completar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },
};