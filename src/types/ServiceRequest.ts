import { User } from './User';

export interface ServiceRequest {
  _id: string;
  category: string;
  description: string;
  address: string;
  requestDate: string;
  preferredTime?: string;
  urgency: 'low' | 'normal' | 'high' | 'emergency';
  status: 'pending' | 'in-process' | 'completed' | 'cancelled' | 'assigned';
  createdAt: string;
  clientId: string | User;
  technicianId?: string | User;
}
