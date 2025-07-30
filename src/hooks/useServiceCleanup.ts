import { useEffect } from 'react';
import type { ServiceRequest } from '../types/ServiceRequest';

/**
 * Hook personalizado para manejar la eliminación automática de servicios
 * cuando se completan o cancelan
 */
export const useServiceCleanup = (
  serviceRequests: ServiceRequest[],
  onDeleteConversation: (conversationId: string) => void
) => {
  useEffect(() => {
    // Verificar servicios completados o cancelados
    const completedOrCancelledServices = serviceRequests.filter(
      request => request.status === 'completed' || request.status === 'cancelled'
    );

    // Eliminar conversaciones asociadas a servicios completados/cancelados
    completedOrCancelledServices.forEach(service => {
      // Crear un ID de conversación basado en el servicio
      // Esto asume que el ID de conversación se basa en el ID del servicio
      const conversationId = `service-${service._id}`;
      
      // Eliminar la conversación después de un pequeño delay
      // para permitir que el usuario vea el estado final
      setTimeout(() => {
        onDeleteConversation(conversationId);
      }, 5000); // 5 segundos de delay
    });
  }, [serviceRequests, onDeleteConversation]);
};