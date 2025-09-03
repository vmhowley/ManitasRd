import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceRequestService } from '../services/serviceRequestService';
import type { ServiceRequest } from '../types/ServiceRequest';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, MapPin, Calendar, Phone, Mail,  MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/User';
import type { Technician } from '../types/Technician';
import { useToast } from '../context/ToastContext';
import { getAvatarUrl } from '../utils/avatarUtils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const ServiceDetails: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [clientUser, setClientUser] = useState<User | null>(null); // New state for client user
  const [technicianUser, setTechnicianUser] = useState<Technician | null>(null); // New state for technician user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptRequest = async () => {
    if (!id) return;
    try {
      await serviceRequestService.acceptRequest(id, user?.id || '');
      showToast('Solicitud aceptada con éxito!', 'success');
      // Refresh the request data to show updated status
      const updatedRequest = await serviceRequestService.getRequestById(id);
      setRequest(updatedRequest);
    } catch (err) {
      console.error('Error accepting request:', err);
      showToast('Hubo un error al aceptar la solicitud.', 'error');
    }
  };

  const handleCancelRequest = async () => {
    if (!id) return;
    try {
      await serviceRequestService.cancelRequest(id);
      showToast('Solicitud cancelada con éxito!', 'success');
      navigate('/booking');
    } catch (err) {
      console.error('Error canceling request:', err);
      showToast('Hubo un error al cancelar la solicitud.', 'error');
    }
  };

  const handleCompleteRequest = async () => {
    if (!id) return;
    try {
      await serviceRequestService.completeRequest(id);
      showToast('Solicitud completada con éxito!', 'success');
      navigate('/technician-home');
    } catch (err) {
      console.error('Error completing request:', err);
      showToast('Hubo un error al completar la solicitud.', 'error');
    }
  };

  // const handleStartChat = () => {
  //   const chatPartnerId = user?.type === 'technician' ? clientUser?._id : technicianUser?._id;
  //   if (chatPartnerId) {
  //     navigate('/messaging', { state: { selectedUserId: chatPartnerId } });
  //   }
  // };

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id) {
        setError('ID de solicitud no proporcionado.');
        setLoading(false);
        return;
      }
      try {
        const fetchedRequest = await serviceRequestService.getRequestById(id);
        setRequest(fetchedRequest);

        // Directly use populated client and technician data
        if (fetchedRequest && fetchedRequest.clientId) {
          setClientUser(fetchedRequest.clientId as User);
        }
        
        if (fetchedRequest && fetchedRequest.technicianId) {
          setTechnicianUser(fetchedRequest.technicianId as Technician);
        }

      } catch (err) {
        console.error('Error fetching request details or user details:', err);
        setError('No se pudo cargar los detalles de la solicitud o del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'assigned':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'in-process':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
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
      case 'pending': return 'Pendiente';
      case 'assigned': return 'Asignada';
      case 'in-process': return 'En Proceso';
      case 'completed': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-primary-100 rounded mb-3"></div>
          <p className="text-neutral-500">Cargando detalles de la solicitud...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <Card variant="elevated" className="max-w-md w-full p-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-accent-500 mb-4" />
            <CardTitle className="mb-2">Error</CardTitle>
            <p className="text-neutral-600">{error}</p>
            <Button 
              variant="primary" 
              className="mt-6" 
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Volver
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <Card variant="elevated" className="max-w-md w-full p-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-neutral-400 mb-4" />
            <CardTitle className="mb-2">Solicitud no encontrada</CardTitle>
            <p className="text-neutral-600">No pudimos encontrar la solicitud que estás buscando.</p>
            <Button 
              variant="primary" 
              className="mt-6" 
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Volver
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string): 'primary' | 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'pending': return 'warning';
      case 'assigned': return 'info';
      case 'in-process': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'info';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="mr-4"
          >
            Volver
          </Button>
          <Badge
            variant={getStatusBadgeVariant(request.status)}
            size="lg"
            icon={getStatusIcon(request.status)}
            className="ml-auto"
          >
            {getStatusText(request.status)}
          </Badge>
        </div>

        <Card variant="elevated" className="mb-6 overflow-visible">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{request.category}</CardTitle>
                <div className="flex items-center mt-2 text-neutral-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {new Date(request.requestDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <Badge
                variant={
                  request?.urgency === "high"
                    ? "error"
                    : request?.urgency === "low"
                    ? "warning"
                    : "info"
                }
                size="md"
              >
                {request.urgency || "Normal"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="bg-neutral-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-neutral-800 mb-2">Descripción</h3>
              <p className="text-neutral-700">{request.description}</p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-neutral-800 mb-2">Ubicación</h3>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                <p className="text-neutral-700">{request.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                variant="bordered"
                padding="sm"
                className="overflow-visible"
              >
                <div className="flex items-center">
                  <img
                    src={getAvatarUrl((clientUser?.name as string) || "")}
                    alt={clientUser?.name || "Cliente"}
                    className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-white shadow-md"
                  />
                  <div>
                    <h3 className="font-medium text-neutral-800">
                      {clientUser?.name || "Cargando..."}
                    </h3>
                    <p className="text-sm text-neutral-500">Cliente</p>
                    {clientUser?.email && (
                      <div className="flex items-center mt-2 text-sm text-neutral-600">
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        <span>{clientUser.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {request.technicianId && (
                <Card
                  variant="bordered"
                  padding="sm"
                  className="overflow-visible"
                >
                  <div className="flex items-center">
                    <img
                      src={getAvatarUrl((technicianUser?.name as string) || "")}
                      alt={technicianUser?.name || "Técnico"}
                      className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-white shadow-md"
                    />
                    <div>
                      <h3 className="font-medium text-neutral-800">
                        {technicianUser?.name || "Cargando..."}
                      </h3>
                      <p className="text-sm text-neutral-500">Técnico</p>
                      {technicianUser?.phone && (
                        <div className="flex items-center mt-2 text-sm text-neutral-600">
                          <Phone className="h-3.5 w-3.5 mr-1" />
                          <span>{technicianUser.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4">
            {user?.type === "technician" && request.status === "pending" && (
              <Button
                variant="primary"
                isFullWidth
                onClick={handleAcceptRequest}
                leftIcon={<CheckCircle className="h-4 w-4" />}
              >
                Aceptar Solicitud
              </Button>
            )}

            {user?.type === "technician" &&
              (request.status === "assigned" ||
                request.status === "in-process") && (
                <Button
                  variant="primary"
                  isFullWidth
                  onClick={handleCompleteRequest}
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                >
                  Completar Servicio
                </Button>
              )}

            {user?.type === "client" &&
              (request.status === "pending" ||
                request.status === "assigned") && (
                <Button
                  variant="danger"
                  isFullWidth
                  onClick={handleCancelRequest}
                  leftIcon={<AlertCircle className="h-4 w-4" />}
                >
                  Cancelar Solicitud
                </Button>
              )}

            {request.technicianId && (
              <Button
                variant="outline"
                isFullWidth
                onClick={() =>
                  navigate(
                    `/messaging?technicianId=${request.technicianId?._id}`
                  )
                }
                leftIcon={<MessageCircle className="h-4 w-4" />}
              >
                Enviar Mensaje
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
