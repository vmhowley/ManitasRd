import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceRequestService } from '../services/serviceRequestService';
import type { ServiceRequest } from '../types/ServiceRequest';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/User';

import { getAvatarUrl } from '../utils/avatarUtils';

export const ServiceDetails: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptRequest = async () => {
    if (!id) return;
    try {
      await serviceRequestService.acceptRequest(id);
      alert('Solicitud aceptada con éxito!');
      navigate('/technician-dashboard');
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Hubo un error al aceptar la solicitud.');
    }
  };

  const handleCancelRequest = async () => {
    if (!id) return;
    try {
      await serviceRequestService.cancelRequest(id);
      alert('Solicitud cancelada con éxito!');
      navigate('/client-dashboard');
    } catch (err) {
      console.error('Error canceling request:', err);
      alert('Hubo un error al cancelar la solicitud.');
    }
  };

  const handleCompleteRequest = async () => {
    if (!id) return;
    try {
      await serviceRequestService.completeRequest(id);
      alert('Solicitud completada con éxito!');
      navigate('/technician-dashboard');
    } catch (err) {
      console.error('Error completing request:', err);
      alert('Hubo un error al completar la solicitud.');
    }
  };

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id) {
        setError('ID de solicitud no proporcionado.');
        setLoading(false);
        return;
      }
      try {
        const fetchedRequest = await serviceRequestService.getRequestById(id);
        setRequest(fetchedRequest.data);
      } catch (err) {
        console.error('Error fetching request details:', err);
        setError('No se pudo cargar los detalles de la solicitud.');
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
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Cargando detalles de la solicitud...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Solicitud no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Detalles de la Solicitud</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Categoría</p>
            <p className="text-lg font-semibold text-gray-900">{request.category}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Estado</p>
            <div className="flex items-center mt-1">
              {getStatusIcon(request.status)}
              <span className="ml-2 text-lg font-semibold text-gray-900">{getStatusText(request.status)}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Fecha Solicitada</p>
            <p className="text-lg font-semibold text-gray-900">{new Date(request.requestDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Urgencia</p>
            <p className="text-lg font-semibold text-gray-900">{request.urgency || 'No especificada'}</p>
          </div>
          
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">Descripción</p>
          <p className="text-gray-700 mt-1">{request.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Dirección</p>
            <div className="flex items-center mt-1">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <p className="text-gray-700">{request.address}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cliente</p>
            <div className="flex items-center mt-1">
              <img
                src={getAvatarUrl((request.clientId as User).name)}
                alt={(request.clientId as User).name || 'Client'}
                className="h-8 w-8 rounded-full object-cover mr-2"
              />
              <p className="text-gray-700">{typeof request.clientId !== 'string' ? request.clientId.name : request.clientId}</p>
            </div>
          </div>
          {request.technicianId && (
            <div>
              <p className="text-sm font-medium text-gray-500">Técnico Asignado</p>
              <div className="flex items-center mt-1">
                <img
                  src={getAvatarUrl((request.technicianId as User).name)}
                  alt={typeof request.technicianId !== 'string' ? request.technicianId.name : 'Technician'}
                  className="h-8 w-8 rounded-full object-cover mr-2"
                />
                <p className="text-gray-700">{typeof request.technicianId !== 'string' ? request.technicianId.name : request.technicianId}</p>
              </div>
            </div>
          )}
        </div>

        

        {user?.type === 'technician' && request.status === 'pending' && (
          <button
            onClick={handleAcceptRequest}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Aceptar Solicitud
          </button>
        )}

        {user?.type === 'technician' && (request.status === 'assigned' || request.status === 'in-process') && (
          <button
            onClick={handleCompleteRequest}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-4"
          >
            Completar Servicio
          </button>
        )}

        {user?.type === 'client' && (request.status === 'pending' || request.status === 'assigned') && (
          <button
            onClick={handleCancelRequest}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors mt-4"
          >
            Cancelar Solicitud
          </button>
        )}
      </div>
    </div>
  );
};
