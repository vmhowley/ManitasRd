import { useEffect, useState } from 'react';
import { quoteRequestService, type QuoteRequest } from '../services/quoteRequestService';
import { serviceRequestService } from '../services/serviceRequestService';
import type { ServiceRequest } from '../types/ServiceRequest';
import { useAuth } from '../context/AuthContext';
import { Wrench, MapPin, Tag, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AvailableRequests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
    const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedQuoteRequests = await quoteRequestService.getQuoteRequests();
      const availableQuoteRequests = fetchedQuoteRequests.filter((req: QuoteRequest) => {
        const isPendingOrQuoted = ['pending', 'quoted'].includes(req.status);
        const hasMatchingSpecialty = user?.specialties?.some(specialty =>
          req.category.toLowerCase().includes(specialty.toLowerCase()) ||
          specialty.toLowerCase().includes(req.category.toLowerCase())
        );
        return isPendingOrQuoted && hasMatchingSpecialty;
      });
      setQuoteRequests(availableQuoteRequests);

      const fetchedServiceRequests = await serviceRequestService.getAvailableRequests();
      const availableServiceRequests = fetchedServiceRequests.filter((req) => {
        const isPending = req.status === 'pending';
        const isNotAssigned = !req.technicianId;
        const hasMatchingSpecialty = user?.specialties?.some(specialty =>
          req.category.toLowerCase().includes(specialty.toLowerCase()) ||
          specialty.toLowerCase().includes(req.category.toLowerCase())
        );
        return isPending && isNotAssigned && hasMatchingSpecialty;
      });
      setServiceRequests(availableServiceRequests);

    } catch (err) {
      console.error('Error fetching available requests:', err);
      setError('No se pudieron cargar las solicitudes disponibles.');
    } finally {
      setLoading(false);
    }
  };
  
    if (user && user.type === 'technician') {
      fetchRequests();
    } else if (user && user.type === 'client') {
      navigate("/client-dashboard"); // Redirect clients
    }
  }, [user, navigate]);

  const handleViewDetails = (requestId: string, type: 'service' | 'quote') => {
    if (type === 'service') {
      navigate(`/requests/${requestId}`);
    } else {
      navigate(`/quote-request/${requestId}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando solicitudes...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!user || user.type !== 'technician') {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Solicitudes Disponibles</h1>
        <p className="text-gray-600 mb-8">
          Explora las solicitudes de clientes y envía tu propuesta o acepta un servicio.
        </p>

        {/* Available Service Requests */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Servicios Estándar Pendientes</h2>
        {serviceRequests.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow-md p-12 mb-8">
            <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">No hay servicios estándar pendientes para ti.</p>
            <p className="text-gray-500 mt-2">¡Revisa tus especialidades o espera nuevas solicitudes!</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {serviceRequests.map((request) => (
              <div key={request._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(request._id, 'service')}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{request.category}</h2>
                    <p className="text-sm text-gray-600">{request.description.substring(0, 100)}{request.description.length > 100 && '...'}</p>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Servicio Estándar
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600 mt-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{request.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Precio Estimado: RD${request.finalPrice?.toFixed(2) || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex justify-end items-center mt-4">
                    <span className="text-blue-600 font-semibold text-sm inline-flex items-center">
                        Ver Detalles
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Available Quote Requests */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Solicitudes de Cotización Pendientes</h2>
        {quoteRequests.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow-md p-12">
            <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">No hay nuevas solicitudes de cotización.</p>
            <p className="text-gray-500 mt-2">Vuelve a revisar más tarde, ¡nuevos trabajos llegan todo el tiempo!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quoteRequests.map((request) => (
              <div key={request._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(request._id, 'quote')}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{request.description.substring(0, 100)}{request.description.length > 100 && '...'}</h2>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Necesita Cotización
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600 mt-2">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{request.category}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{request.location}</span>
                  </div>
                </div>

                <div className="flex justify-end items-center mt-4">
                    <span className="text-blue-600 font-semibold text-sm inline-flex items-center">
                        Ver y Cotizar
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

