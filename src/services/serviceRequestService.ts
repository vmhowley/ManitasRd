import type { User } from '../types/User';

interface ServiceRequestData {
  category: string;
  description: string;
  location: string;
  preferredDate: string;
  preferredTime?: string;
  urgency: string;
}

interface ServiceRequest extends ServiceRequestData {
  id: string;
  clientId: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string;
}

// This is a mock API service for service requests.
export const serviceRequestService = {
  submitServiceRequest: async (requestData: ServiceRequestData, clientId: string): Promise<ServiceRequest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: ServiceRequest = {
          ...requestData,
          id: Date.now().toString(),
          clientId: clientId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        console.log('Mock API: Service request submitted:', newRequest);
        resolve(newRequest);
      }, 1000);
    });
  },

  // In a real application, you would add more functions here, e.g.:
  // getClientServiceRequests: async (clientId: string): Promise<ServiceRequest[]> => { ... },
  // getTechnicianServiceRequests: async (technicianId: string): Promise<ServiceRequest[]> => { ... },
  // updateServiceRequestStatus: async (requestId: string, status: string): Promise<ServiceRequest> => { ... },
};
