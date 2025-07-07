import React, { useEffect, useState } from 'react';
import { serviceRequestService } from '../services/serviceRequestService';
import { useAuth } from '../context/AuthContext';
import type { ServiceRequest } from '../types/ServiceRequest';
import { Wrench, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AvailableRequests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const requests = await serviceRequestService.getAvailableRequests();
      setAvailableRequests(requests);
    } catch (err) {
      console.error('Error fetching available requests:', err);
      setError('No se pudieron cargar las solicitudes disponibles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.type === 'technician') {
      fetchAvailableRequests();
    } else if (user && user.type === 'client') {
      navigate('/client-dashboard'); // Redirect clients
    }
  }, [user, navigate]);

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) {
      alert('Debes iniciar sesión para aceptar solicitudes.');
      return;
    }
    try {
      await serviceRequestService.acceptRequest(requestId);
      alert('Solicitud aceptada con éxito!');
      fetchAvailableRequests(); // Refresh the list
      // Optionally, navigate to technician's assigned requests or dashboard
      navigate('/technician-dashboard');
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Hubo un error al aceptar la solicitud. Inténtalo de nuevo.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando solicitudes disponibles...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!user || user.type !== 'technician') {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Solicitudes Disponibles</h1>
        <p className="text-gray-600 mb-8 text-center">
          Explora las solicitudes de servicio que coinciden con tus especialidades y acepta las que te interesen.
        </p>

        {availableRequests.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay solicitudes disponibles que coincidan con tus especialidades en este momento.</p>
            <p className="text-gray-500 mt-2">¡Vuelve a revisar más tarde o actualiza tus especialidades!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {availableRequests.map((request) => (
              <div key={request._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{request.category}</h2>
                    <p className="text-gray-600 text-sm">ID: {request._id}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {request.status === 'pending' ? 'Pendiente' : request.status}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{request.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{request.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Urgencia: {request.urgency}</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Creada: {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptRequest(request._id)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading} // Disable button while accepting
                >
                  Aceptar Solicitud
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
