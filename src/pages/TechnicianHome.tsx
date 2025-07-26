import { useEffect, useState } from 'react';
import { Clock, AlertCircle, DollarSign, MapPin, Briefcase, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { serviceRequestService } from '../services/serviceRequestService';
import type { ServiceRequest } from '../types/ServiceRequest';

import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';

export const TechnicianHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { showToast } = useToast();
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [assignedRequests, setAssignedRequests] = useState<ServiceRequest[]>([]);
  const [completedRequests, setCompletedRequests] = useState<ServiceRequest[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Obtener solicitudes disponibles (sin asignar)
      const fetchedServiceRequests = await serviceRequestService.getAvailableRequests();
      
      const availableServiceRequests = fetchedServiceRequests.filter(
        (req) => {
          const isPending = req.status === "pending";
          const isNotAssigned = !req.technicianId;
          const hasMatchingSpecialty = user?.specialties?.some(
            (specialty) =>
              req.category.toLowerCase().includes(specialty.toLowerCase()) ||
              specialty.toLowerCase().includes(req.category.toLowerCase())
          );
          return isPending && isNotAssigned && hasMatchingSpecialty;
        }
      );
      
      // Obtener TODAS las solicitudes para encontrar las asignadas al técnico
      const allRequests = await serviceRequestService.getRequests();
      
      const myAssignedRequests = allRequests.filter(
        (req) => {
          const techId = req.technicianId;
          const userId = user?.id;
          
          return (
            techId === userId &&
            ["assigned", "in-process"].includes(req.status)
          );
        }
      );
      
      const myCompletedRequests = allRequests.filter(
        (req) => {
          const techId = req.technicianId;
          const userId = user?.id;
          
          return techId === userId && req.status === "completed";
        }
      );
      
      setAvailableRequests(availableServiceRequests);
      setAssignedRequests(myAssignedRequests);
      setCompletedRequests(myCompletedRequests);
      
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para aceptar una solicitud
  const handleAcceptRequest = async () => {
    try {
      showToast('Aceptando solicitud...', 'info');
      
      // Aceptar la solicitud
      // await serviceRequestService.acceptRequest(requestId);
      
      showToast('¡Solicitud aceptada exitosamente!', 'success');
      
      // Actualizar las listas de solicitudes
      await fetchRequests();
      
    } catch (error) {
      console.error('Error accepting request:', error);
      const errorMessage = (error as any).response?.data?.msg || (error as Error).message || 'Error al aceptar la solicitud';
      showToast(`Error: ${errorMessage}`, 'error');
    }
  };

  useEffect(() => {
    if (user && user.type === "technician") {
      fetchRequests();
    }
  }, [user]);

  // Socket listeners para nuevas solicitudes
  useEffect(() => {
    if (!socket || !user || user.type !== "technician") return;
    
    const handleNewServiceRequest = (data: any) => {
      showToast(
        `Nueva solicitud: ${data.serviceName}`,
        'notification',
        {
          title: 'Nueva oportunidad de trabajo',
          duration: 8000,
          position: 'top-right',
          actionLabel: 'Ver detalles',
          onAction: () => navigate('/available-requests')
        }
      );
      fetchRequests();
    };
    
    socket.on('newServiceRequest', handleNewServiceRequest);
    
    return () => {
      socket.off('newServiceRequest', handleNewServiceRequest);
    };
  }, [socket, user, showToast, navigate]);

  const totalEarnings = completedRequests.length * 150; // Estimación

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section - Focused on Action */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ¡Listo para trabajar! 🚀
            </h1>
            <p className="text-2xl text-green-100 mb-8">
              {availableRequests.length > 0 
                ? `${availableRequests.length} trabajos esperándote`
                : "Mantente atento a nuevas oportunidades"
              }
            </p>
            
            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
              <button
                onClick={() => navigate('/available-requests')}
                className="bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                🔍 Buscar Trabajos ({availableRequests.length})
              </button>
              <button
                onClick={() => navigate('/messaging')}
                className="bg-green-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-400 transition-all transform hover:scale-105 shadow-lg"
              >
                💬 Mis Mensajes
              </button>
            </div>
            
            {/* Quick Status */}
            <div className="flex justify-center items-center space-x-8 text-lg">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-yellow-300 mr-2" />
                <span>{assignedRequests.length} en proceso</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-green-300 mr-2" />
                <span>RD${totalEarnings.toLocaleString()} ganados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Alert */}
      {availableRequests.length > 0 && (
        <section className="py-8 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-600 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">
                    ¡{availableRequests.length} nuevas oportunidades disponibles!
                  </h3>
                  <p className="text-yellow-700">
                    Trabajos que coinciden con tus especialidades están esperando
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/available-requests')}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
              >
                Ver Ahora
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Trabajos Disponibles</h3>
                  <p className="text-blue-100 mb-4">Encuentra nuevas oportunidades</p>
                  <button
                    onClick={() => navigate('/available-requests')}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Explorar Trabajos
                  </button>
                </div>
                <Briefcase className="h-12 w-12 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Mis Mensajes</h3>
                  <p className="text-green-100 mb-4">Comunícate con tus clientes</p>
                  <button
                    onClick={() => navigate('/messaging')}
                    className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  >
                    Ver Mensajes
                  </button>
                </div>
                <MessageCircle className="h-12 w-12 text-green-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mis Trabajos Activos */}
      {assignedRequests.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Trabajos Activos</h2>
            <div className="space-y-4">
              {assignedRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.category}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'assigned' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {request.status === 'assigned' ? 'Asignada' : 'En Proceso'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{request.address}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => navigate(`/requests/${request._id}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Ver Detalles
                        </button>
                        {request.status === 'in-process' && request.clientId && (
                          <button
                            onClick={() => navigate(`/chat/${request.clientId._id}/${request._id}`)}
                            className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chatear
                          </button>
                        )}
                      </div>
                    </div>
                    {request.finalPrice && (
                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-green-600">RD${request.finalPrice}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-8 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Listo para trabajar?</h2>
          <p className="text-gray-600 mb-6">Encuentra trabajos que se ajusten a tus habilidades y horarios</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/available-requests')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explorar Trabajos
            </button>
            <button
              onClick={() => navigate('/edit-technician-profile')}
              className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Actualizar Perfil
            </button>
          </div>
        </div>
      </section>
      
      {/* Tarjeta de Acción Flotante - Solo mostrar si hay solicitudes disponibles */}
      {availableRequests.length > 0 && (
        <div className="fixed bottom-6 inset-x-8 bg-white rounded-2xl shadow-2xl p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">{availableRequests[0]?.category}</h3>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  RD${availableRequests[0]?.finalPrice || 'N/A'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{availableRequests[0]?.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{availableRequests[0]?.address}</span>
              </div>
            </div>
            <div className="ml-6 flex items-center space-x-3">
              <button
                onClick={() => navigate(`/requests/${availableRequests[0]?._id}`)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Ver Detalles
              </button>
              <div className="relative">
                <button 
                  onClick={() => handleAcceptRequest()}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors relative z-10"
                >
                  Aceptar
                </button>
                <div className="absolute inset-0 bg-green-500/40 rounded-lg animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};