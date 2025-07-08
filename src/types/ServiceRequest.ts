import type { User } from './User';

export interface PriceModifier {
  _id: string;
  name: string;
  additionalCost: number;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  unitType?: string; // e.g., 'hour', 'sq_meter', 'unit', 'fixed'
  pricePerUnit?: number;
  priceModifiers: PriceModifier[];
  isActive: boolean;
}

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
  clientId: string | User;
  technicianId?: string | User;
}
// Added a comment to force re-evaluation
