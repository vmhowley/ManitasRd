export interface ServiceRequest {
  id: string;
  category: string;
  description: string;
  location: string;
  preferredDate: string;
  preferredTime?: string;
  urgency: 'baja' | 'media' | 'alta';
  status: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
  createdAt: string;
  clientId: string;
  technicianId?: string;
}
