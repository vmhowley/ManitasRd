export interface ServiceRequest {
  _id: string;
  category: string;
  description: string;
  address: string;
  preferredDate: string;
  preferredTime?: string;
  urgency: 'baja' | 'media' | 'alta';
  status: 'pending' | 'in-process' | 'completed' | 'cancelled' | 'assigned';
  createdAt: string;
  clientId: string;
  technicianId?: string;
}
