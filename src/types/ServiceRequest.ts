import type { User } from './User';

export interface ServiceRequest {
  _id: string;
  category: string;
  description: string;
  address: string;
  requestDate: string;
  preferredTime?: string;
  urgency: 'low' | 'normal' | 'high' | 'emergency';
  finalPrice?: number; // New field for standard services
  serviceId?: string; // New field for standard services (ID of the StandardService)
  status: 'pending' | 'in-process' | 'completed' | 'cancelled' | 'assigned';
  createdAt: string;
  clientId: User;
  technicianId?: User;
}
// Added a comment to force re-evaluation
