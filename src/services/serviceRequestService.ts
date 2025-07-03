import axios from 'axios';
import type { ServiceRequest } from '../types/ServiceRequest';

const API_BASE_URL = 'http://localhost:5000/api';

interface ServiceRequestData {
  categoria: string;
  descripcion: string;
  ubicacion: string;
  fechaPreferida: string;
  horaPreferida?: string;
  urgencia: string;
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
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  },

  // Obtener solicitudes por cliente (usa endpoint /solicitudes/client/:id)
  getByClientId: async (clienteId: string): Promise<ServiceRequest[]> => {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(`${API_BASE_URL}/solicitudes`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return res.data;
  },

  // Obtener solicitudes por técnico
  getBytecnicoId: async (tecnicoId: string): Promise<ServiceRequest[]> => {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(`${API_BASE_URL}/solicitudes`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return res.data;
  },
};
