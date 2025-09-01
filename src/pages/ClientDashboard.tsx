import { useEffect, useState } from 'react';
import {
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Star,
  DollarSign,
  Wrench,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { serviceRequestService } from '../services/serviceRequestService';
import type { ServiceRequest } from '../types/ServiceRequest';
import { quoteRequestService, type QuoteRequest } from '../services/quoteRequestService';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../context/SocketContext';
import { Button, Card, CardContent } from '../components/ui';

export const ClientDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { socket } = useSocket();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  // const [showReviewModal, setShowReviewModal] = useState(false);
  // const [selectedServiceRequestForReview, setSelectedServiceRequestForReview] = useState<ServiceRequest | null>(null);
  

  const fetchRequests = async () => {
    console.log('=== DEBUG FETCH REQUESTS ===');
    console.log('User:', user);
    console.log('User UID:', user?.uid);
    console.log('Auth Loading:', authLoading);
    
    if (user && !authLoading) {
      try {
        console.log('Fetching service requests for user:', user.uid);
        const fetchedServiceRequests =
          await serviceRequestService.getRequests(user.uid);
        
        console.log('Raw service requests response:', fetchedServiceRequests);

        if (Array.isArray(fetchedServiceRequests)) {
          console.log('Service requests count:', fetchedServiceRequests.length);
          setServiceRequests(fetchedServiceRequests);
        } else {
          console.error(
            "Fetched service requests data is not an array:",
            fetchedServiceRequests
          );
          setServiceRequests([]);
        }

        console.log('Fetching quote requests for user:', user.uid);
        const fetchedQuoteRequests =
          await quoteRequestService.getQuoteRequests(user.uid);
        console.log('Raw quote requests response:', fetchedQuoteRequests);
        if (Array.isArray(fetchedQuoteRequests)) {
          console.log('Quote requests count:', fetchedQuoteRequests.length);
          setQuoteRequests(fetchedQuoteRequests);
        } else {
          console.error(
            "Fetched quote requests data is not an array:",
            fetchedQuoteRequests
          );
          setQuoteRequests([]);
        }
        
        console.log('=== END DEBUG FETCH REQUESTS ===');
      } catch (error: unknown) {
        console.error("Error fetching requests:", error);
        if (typeof error === "object" && error !== null && "message" in error) {
          const errMsg = (error as { message: string }).message;
          if (errMsg === "Network Error") {
            showToast(
              "Error de red: No se pudo conectar con el servidor. Asegúrate de que el servidor esté en funcionamiento.",
              "error"
            );
          } else {
            showToast(
              "Error al cargar las solicitudes: " + errMsg,
              "error"
            );
          }
        } else {
          showToast(
            "Error desconocido al cargar las solicitudes.",
            "error"
          );
        }
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user, authLoading, showToast]);
  
  // Refrescar solicitudes cuando el componente se monta o cuando se regresa al dashboard
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user && !authLoading) {
        fetchRequests();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, authLoading]);
  
  // Escuchar eventos de socket para solicitudes aceptadas
  useEffect(() => {
    if (!socket || !user || user.type !== "client") {
      return;
    }
    
    
    // Forzar reconexión del socket para asegurar que esté activo
    if (socket.disconnected) {
      console.log("Socket desconectado, intentando reconectar...");
      socket.connect();
    }
    
    const handleRequestAccepted = (data: {
      solicitudId: string;
      technicianName: string;
      serviceName: string;
    }) => {
      // Mostrar notificación toast
      showToast(
        `¡${data.technicianName} ha aceptado tu solicitud de ${data.serviceName}!`,
        "success",
        {
          title: "Solicitud aceptada",
          duration: 8000,
          position: "top-right",
          actionLabel: "Ver detalles",
          onAction: () => navigate(`/requests/${data.solicitudId}`),
        }
      );

      // Actualizar la lista de solicitudes
      fetchRequests();
    };
    
    
    // Eliminada la prueba manual de notificaciones
    
    // Registrar todos los eventos recibidos
    const handleAnyEvent = (eventName: string, ...args: any[]) => {
      console.log(`Cliente recibió evento: ${eventName}`, args);
    };
    

    
    // Registrar los listeners
    console.log("Registrando listeners para cliente");
    socket.onAny(handleAnyEvent);
    socket.on('requestAccepted', handleRequestAccepted);

    
    return () => {
      console.log("Limpiando listeners de socket para cliente");
      socket.off('requestAccepted', handleRequestAccepted);
      socket.offAny(handleAnyEvent);
    };
  }, [socket, user, showToast, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'quoted':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'assigned':
      case 'in-process':
      case 'in_progress':
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'assigned':
        return 'Asignado';
      case 'in-process':
        return 'En Proceso';
      case 'in_progress':
        return 'En Progreso';
      case 'quoted':
        return 'Cotizado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  console.log('=== CLIENT DASHBOARD DEBUG ===');
  console.log('User:', user ? { uid: user.uid, _id: user._id, email: user.email, type: user.type } : 'No user');
  console.log('Auth Loading:', authLoading);
  console.log('Service Requests RAW:', serviceRequests);
  console.log('Service Requests Length:', serviceRequests.length);
  console.log('Quote Requests RAW:', quoteRequests);
  console.log('Quote Requests Length:', quoteRequests.length);
  
  // Debug each service request
  serviceRequests.forEach((req, index) => {
    const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
    console.log(`ServiceRequest ${index}:`, {
      id: req._id,
      clientId: clientId,
      userUID: user?.uid,
      matches: user && user.uid && clientId === user.uid,
      status: req.status,
      category: req.category
    });
  });
  
  // Debug each quote request
  quoteRequests.forEach((req, index) => {
    const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
    console.log(`QuoteRequest ${index}:`, {
      id: req._id,
      clientId: clientId,
      userUID: user?.uid,
      matches: user && user.uid && clientId === user.uid,
      status: req.status,
      category: req.category
    });
  });

  const activeServiceRequests = serviceRequests.filter((req) => {
       // Handle both string clientId and object clientId
       const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
       const userMatches = user && user.uid && clientId === user.uid;
       const statusMatches = ['pending', 'assigned', 'in-process'].includes(req.status);
       const matches = userMatches && statusMatches;
       
       console.log(`Request ${req._id}: clientId=${clientId}, userUID=${user?.uid}, status=${req.status}, match=${matches}`);

       return matches;
     });
     
  console.log('Active Service Requests after filtering:', activeServiceRequests.length);

  const activeQuoteRequests = quoteRequests.filter((req) => {
    const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
    return user && user.uid && clientId === user.uid && ['pending', 'quoted', 'in_progress'].includes(req.status);
  });

  const completedServiceRequests = serviceRequests.filter((req) => {
    const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
    return user && user.uid && clientId === user.uid && ['completed', 'cancelled'].includes(req.status);
  });

  const completedQuoteRequests = quoteRequests.filter((req) => {
    const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
    return user && user.uid && clientId === user.uid && ['completed', 'cancelled'].includes(req.status);
  });

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className=" rounded-2xl shadow-xl  mb-4 p-2">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <Button
                variant="primary"
                onClick={() => navigate("/request-service")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Solicitar Servicio
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/request-quote")}

              >
                <FileText className="h-4 w-4 mr-2" />
                Solicitar Presupuesto
              </Button>
            </div>
          </CardContent>
        </div>

        {authLoading ? (
          <div className="text-center py-8">Cargando tus solicitudes...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
            {/* Main Content */}
            <CardContent className="lg:col-span-2 space-y-8 ">
              {/* Active Standard Services */}
              <div className=" rounded-2xl shadow-xl ">
                <h2 className="text-xl font-semibold mb-6">
                  Servicios Estándar Activos
                </h2>
                {activeServiceRequests.length === 0 ? (
                  <Card className="text-center py-12">
                    <Calendar className="h-12 w-12  mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      No tienes servicios estándar activos.
                    </p>
                    <button
                      onClick={() => navigate("/request-service")}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Solicitar tu primer servicio estándar
                    </button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {activeServiceRequests.map((request) => {
                      return (
                        <div
                          key={request._id}
                          className="border border-border rounded-lg p-2 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center  ">
                                {getStatusIcon(request.status)}
                                <span className="ml-2 font-medium ">
                                  {request.category}
                                </span>
                                {/* <span className="ml-2 text-sm text-gray-500 line-clamp-1">
                                  #{request._id}
                                </span> */}
                              </div>
                              <p className="text-xs  mb-2">
                                {request.description}
                              </p>
                              {request.finalPrice && (
                                <p className="text-lg font-bold text-primary-500 flex items-center mb-2">
                                  <DollarSign className="h-5 w-5 mr-1" />{" "}
                                  {request.finalPrice.toFixed(2)}
                                </p>
                              )}
                              <div className="flex items-center text-sm text-primary-300  space-x-4">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {request.address}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(
                                    request.requestDate
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end w-[80px]">
                              <span
                                className={`px-2 py-1 rounded-md text-xs font-medium whitespace-normal break-words text-center ${
                                  request.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : request.status === "assigned"
                                    ? "bg-blue-500/20 text-blue-300"
                                    : request.status === "in-process"
                                    ? "bg-orange-500/20 text-orange-300"
                                    : "bg-gray-500/20 text-gray-300"
                                }`}
                              >
                                {getStatusText(request.status)}
                              </span>
                              {request.status !== "pending" && (
                                <div className="flex flex-col items-end">
                                  <button
                                    onClick={() =>
                                      navigate(`/requests/${request._id}`)
                                    }
                                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                                  >
                                    Ver detalles
                                  </button>
                                  {request.status === "in-process" &&
                                    request.technicianId && (
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/chat/${request.technicianId?._id}/${request._id}`
                                          )
                                        }
                                        className="mt-2 text-green-600 hover:text-green-700 text-sm flex items-center"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="lucide lucide-message-circle-more"
                                        >
                                          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                                          <path d="M8 12h.01" />
                                          <path d="M12 12h.01" />
                                          <path d="M16 12h.01" />
                                        </svg>
                                        <span className="ml-1">Chatear</span>
                                      </button>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Active Quote Requests */}
              <div className=" rounded-2xl shadow-xl ">
                <h2 className="text-xl font-semibold  mb-6">
                  Solicitudes de Presupuesto Activas
                </h2>
                {activeQuoteRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12  mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      No tienes solicitudes de presupuesto activas.
                    </p>
                    <button
                      onClick={() => navigate("/request-quote")}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Solicitar un Presupuesto Personalizado
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeQuoteRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              {getStatusIcon(request.status)}
                              <span className="ml-2 font-medium ">
                                {request.category}
                              </span>
                            </div>
                            <p className="text-xs mb-2">
                              {request.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <div className="flex items-center text-xs">
                                <MapPin className="h-4 w-4 mr-1" />
                                {request.location}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(
                                  request.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            {request.proposals?.length > 0 &&
                              request.status === "quoted" && (
                                <p className="text-sm text-gray-700 mt-2">
                                  <span className="font-semibold">
                                    {request.proposals.length}
                                  </span>{" "}
                                  propuestas recibidas.
                                </p>
                              )}
                            {request.status === "in_progress" &&
                              request.selectedTechnicianId &&
                              request.acceptedProposalId && (
                                <p className="text-sm text-gray-700 mt-2">
                                  <span className="font-semibold">
                                    Técnico Asignado:
                                  </span>{" "}
                                  {request.selectedTechnicianId.name}
                                  <span className="ml-2 text-lg font-bold text-blue-600">
                                    RD$
                                    {request.proposals
                                      .find(
                                        (p) =>
                                          p._id === request.acceptedProposalId
                                      )
                                      ?.totalPrice.toFixed(2)}
                                  </span>
                                </p>
                              )}
                          </div>
                          <div className="flex flex-col items-end w-[80px]">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium whitespace-normal break-words text-center ${
                                request.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : request.status === "quoted"
                                  ? "bg-purple-500/20 text-purple-300"
                                  : request.status === "in_progress"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-gray-500/20 text-gray-300"
                              }`}
                            >
                              {getStatusText(request.status)}
                            </span>
                            <button
                              onClick={() =>
                                navigate(`/quote-request/${request._id}`)
                              }
                              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service History (Completed & Cancelled) */}
              <div className=" rounded-2xl shadow-xl ">
                <h2 className="text-xl font-semibold  mb-6">
                  Historial de Servicios y Presupuestos
                </h2>
                {completedServiceRequests.length === 0 &&
                completedQuoteRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No tienes servicios o presupuestos completados/cancelados
                      aún.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...completedServiceRequests, ...completedQuoteRequests]
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((request) => (
                        <div
                          key={request._id}
                          className="border border-border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-2">
                                {getStatusIcon(request.status)}
                                <span className="ml-2 font-medium ">
                                  {request.category}
                                </span>
                               
                              </div>
                              <p className="text-xs mb-2">
                                {request.description}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(
                                  request.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex flex-col items-end w-[80px]">
                              <span
                                className={`px-1 py-1 rounded-full text-xs font-medium whitespace-normal break-words text-center ${
                                  request.status === "completed"
                                    ? "bg-green-500/20 text-green-300"
                                    : "bg-red-500/20 text-red-300"
                                }`}
                              >
                                {getStatusText(request.status)}
                              </span>
                              {request.status === "completed" &&
                                "technicianId" in request &&
                                request.technicianId && (
                                  <button
                                    // onClick={() => {
                                    //   setSelectedServiceRequestForReview(request as ServiceRequest);
                                    //   setShowReviewModal(true);
                                    // }}
                                    className="flex items-center mt-2 text-blue-600 hover:text-blue-700 text-sm"
                                  >
                                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                    Calificar
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold  mb-4">
                  Resumen
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Servicios Activos</span>
                    <span className="font-semibold text-blue-600">
                      {activeServiceRequests.length +
                        activeQuoteRequests.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Servicios Completados</span>
                    <span className="font-semibold text-green-600">
                      {completedServiceRequests.filter(
                        (r) => r.status === "completed"
                      ).length +
                        completedQuoteRequests.filter(
                          (r) => r.status === "completed"
                        ).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Total de Solicitudes</span>
                    <span className="font-semibold ">
                      {(serviceRequests.filter(req => {
                        const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
                        return user && user.uid && clientId === user.uid;
                      }).length) + (quoteRequests.filter(req => {
                        const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
                        return user && user.uid && clientId === user.uid;
                      }).length)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* {showReviewModal && selectedServiceRequestForReview && (
        <ReviewForm
          serviceRequestId={selectedServiceRequestForReview._id}
          technicianId={selectedServiceRequestForReview.technicianId }
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={() => {
            setShowReviewModal(false);
            setSelectedServiceRequestForReview(null);
            // Optionally, re-fetch requests to update the UI
            // fetchRequests(); 
          }}
        />
      )} */}
    </div>
  );
};