import { useEffect, useState } from "react";
import {
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  MapPin
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { serviceRequestService } from "../services/serviceRequestService";
import type { ServiceRequest } from "../types/ServiceRequest";
import { getAvatarUrl } from "../utils/avatarUtils";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";

export const TechnicianDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { showToast } = useToast();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [assignedRequests, setAssignedRequests] = useState<ServiceRequest[]>([]); 
  const [allRequest, setAllRequests] = useState<ServiceRequest[]>([]); 

  const fetchRequests = async () => {
    try {
    

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
      setAllRequests(allRequests);
      
      const myAssignedRequests = allRequests.filter(
        (req) => {
          // Obtener el ID del técnico, ya sea como objeto o string
          const techId =  req.technicianId;
          // Obtener el ID del usuario actual, ya sea _id o id
          const userId = user?.id;
          
          const isAssigned =
            techId === userId &&
            ["assigned", "in-process"].includes(req.status);
          
          return isAssigned;
        }
      );
      
      setServiceRequests(availableServiceRequests);
      setAssignedRequests(myAssignedRequests);
      
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Función para aceptar una solicitud
  const handleAcceptRequest = async (requestId: string) => {
  
    
    try {
     
      // Mostrar loading state
      showToast('Aceptando solicitud...', 'info');
      
      // Aceptar la solicitud
      // const result = await serviceRequestService.acceptRequest(requestId);
      
      // Mostrar mensaje de éxito
      showToast('¡Solicitud aceptada exitosamente!', 'success');
      
      // Actualizar las listas de solicitudes
      await fetchRequests();
      
    } catch (error) {
      console.error('Error accepting request:', error);
      console.error('Error details:', (error as any).response?.data || (error as Error).message);
      
      const errorMessage = (error as any).response?.data?.msg || (error as Error).message || 'Error al aceptar la solicitud';
      showToast(`Error: ${errorMessage}`, 'error');
    }
  };

  useEffect(() => {
    if (user && user.type === "technician") {
      fetchRequests();
    } else if (user && user.type === "client") {
      navigate("/client-dashboard");
    }
  }, [user, navigate]);
  
  // Escuchar eventos de socket para nuevas solicitudes
  useEffect(() => {
    if (!socket || !user || user.type !== "technician") {
      return;
    }
    
    const userId = user._id || user.id;
    
    // Forzar reconexión del socket para asegurar que esté activo
    if (socket.disconnected) {
      socket.connect();
    }
    
    const handleNewServiceRequest = (data: any) => {
      // Mostrar notificación toast
      showToast(
        `Nueva solicitud de ${data.clientName}: ${data.serviceName}`,
        'notification',
        {
          title: 'Nueva solicitud de servicio',
          duration: 8000,
          position: 'top-right',
          actionLabel: 'Ver detalles',
          onAction: () => navigate(`/service-details/${data.solicitudId}`)
        }
      );
      
      // Actualizar la lista de solicitudes
      fetchRequests();
    };
    
    // Registrar todos los eventos recibidos
    const handleAnyEvent = (eventName: string, ...args: any[]) => {
      console.log(`Técnico recibió evento: ${eventName}`, args);
    };
    
    // Eliminadas las pruebas manuales de notificaciones
    

    
    // Registrar los listeners
    socket.onAny(handleAnyEvent);
    socket.on('newServiceRequest', handleNewServiceRequest);
    
    return () => {
      socket.off('newServiceRequest', handleNewServiceRequest);
      socket.offAny(handleAnyEvent);
    };
  }, [socket, user, showToast, navigate]);

  // Solicitudes completadas del técnico
  const completedRequests = allRequest.filter(
    (req) => req.status === "completed"
  );
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Cargando datos...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                ¡Hola, {user.name}!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-2">
                Especialidades: {user.specialties?.join(", ")}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span>Rating: {user.rating}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>{completedRequests.length} trabajos completados</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/edit-technician-profile")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm"
            >
              Editar Perfil
            </button>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                Disponibles
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {serviceRequests.length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                En Proceso
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {assignedRequests.length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                Completados
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {completedRequests.length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                Ingresos
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                ${(completedRequests.length * 150).toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Assigned Requests */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Solicitudes Asignadas
              </h2>

              {assignedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No tienes solicitudes asignadas
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedRequests.map((request) => (
                    <div
                      key={request._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {request.category}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {request.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Estado: {request.status === 'assigned' ? 'Asignada' : 'En Proceso'}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/requests/${request._id}`)}
                          className="ml-4 text-blue-600 hover:underline text-sm"
                        >
                          Ver detalles
                        </button>
                        {request.status === 'in-process' && request.clientId && (
                          <button
                            onClick={() => navigate(`/chat/${request.clientId._id}/${request._id}`)}
                            className="ml-4 text-green-600 hover:text-green-700 text-sm flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-circle-more"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
                            <span className="ml-1">Chatear</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile */}
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <img
                src={getAvatarUrl(user.name)}
                alt={`${user.name} avatar`}
                className="mx-auto h-24 w-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="mt-2 text-gray-600">
                Especialidades:{" "}
                {user.specialties?.join(", ") || "No especificadas"}
              </p>
            </div>

            {/* Completed Requests Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen de trabajos
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                {completedRequests.length > 0 ? (
                  completedRequests.slice(0, 5).map((request) => (
                    <li
                      key={request._id}
                      className="border-b border-gray-200 pb-2"
                    >
                      <p className="font-medium">{request.category}</p>
                      <p className="text-gray-500">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </li>
                  ))
                ) : (
                  <p>No has completado trabajos aún.</p>
                )}
              </ul>
            </div>
          </aside>
        </section>
      </main>
      
      {/* Bottom Action Card - Solo mostrar si hay solicitudes disponibles */}
      {serviceRequests.length > 0 && (
        <div className="flex flex-col bg-white divide-y-[1px] gap-2 divide-gray-200 rounded-2xl shadow-2xl p-6 text-center fixed bottom-6 inset-x-8 font-semibold">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <button onClick={() =>  handleAcceptRequest(serviceRequests[0]._id)} className="rounded-full bg-green-500/40 px-13.5 animate-ping py-5 absolute font-semibold text-white"></button>
              <button 
                
                className="rounded-full bg-green-900 px-6 py-2 font-semibold text-white hover:bg-green-800 transition-colors"
              >
                Aceptar
              </button>
            </div>
            <h1 className="text-3xl font-bold">
              DOP${serviceRequests[0]?.finalPrice || 'N/A'}
            </h1>
          </div>
          <div className="flex items-center justify-start gap-2">
            <AlertCircle className="h-5 w-5 text-gray-500" />
            <p className="text-start text-gray-600 p-1">
              {serviceRequests[0]?.description}
            </p>
          </div>
          <div className="flex items-center justify-start p-1 gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <p className="text-start text-gray-600">
              {serviceRequests[0]?.address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
