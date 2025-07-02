export interface ServiceRequest {
  _id: string;
  categoria: string;
  descripcion: string;
  location: string;
  preferredDate: string;
  preferredTime?: string;
  urgency: 'baja' | 'media' | 'alta';
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada' | 'asignada';
  createdAt: string;
  clienteId: string;
  technicianId?: string;
}
