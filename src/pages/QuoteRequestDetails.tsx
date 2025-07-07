import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quoteRequestService, type QuoteRequest } from '../services/quoteRequestService';
import { ArrowLeft, Clock, DollarSign, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatarUtils';

export const QuoteRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState<number | '' >('');

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id) {
        setError('ID de solicitud de presupuesto no proporcionado.');
        setLoading(false);
        return;
      }
      try {
        const fetchedRequest = await quoteRequestService.getQuoteRequestById(id);
        setRequest(fetchedRequest.data);
        if (fetchedRequest.data.quotedPrice) {
          setQuotePrice(fetchedRequest.data.quotedPrice);
        }
      } catch (err) {
        console.error('Error fetching quote request details:', err);
        setError('No se pudo cargar los detalles de la solicitud de presupuesto.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    if (!id || !user) return;
    try {
      let priceToQuote: number | undefined;
      if (status === 'quoted') {
        if (quotePrice === '' || isNaN(Number(quotePrice))) {
          alert('Por favor, ingresa un precio válido para cotizar.');
          return;
        }
        priceToQuote = Number(quotePrice);
      }
      await quoteRequestService.updateQuoteRequestStatus(id, status, priceToQuote);
      alert(`Solicitud ${status === 'quoted' ? 'cotizada' : status === 'accepted' ? 'aceptada' : 'rechazada'} con éxito!`);
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error('Error updating quote request status:', err);
      alert('Hubo un error al actualizar el estado de la solicitud.');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'reviewed': return 'Revisada';
      case 'quoted': return 'Cotizada';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Cargando detalles de la solicitud de presupuesto...</p>
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
        <p className="text-gray-500 text-lg">Solicitud de presupuesto no encontrada.</p>
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

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Detalles de Presupuesto</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Categoría</p>
            <p className="text-lg font-semibold text-gray-900">{request.category}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Estado</p>
            <div className="flex items-center mt-1">
              {request.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
              {request.status === 'quoted' && <DollarSign className="h-5 w-5 text-green-500" />}
              {request.status === 'accepted' && <CheckCircle className="h-5 w-5 text-blue-500" />}
              {request.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
              <span className="ml-2 text-lg font-semibold text-gray-900">{getStatusText(request.status)}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ubicación</p>
            <div className="flex items-center mt-1">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <p className="text-gray-700">{request.location}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Fecha de Solicitud</p>
            <p className="text-lg font-semibold text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">Descripción</p>
          <p className="text-gray-700 mt-1">{request.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Cliente</p>
            <div className="flex items-center mt-1">
              <img
                src={getAvatarUrl(request.clientId?.name)}
                alt={request.clientId?.name || 'Cliente'}
                className="h-8 w-8 rounded-full object-cover mr-2"
              />
              <p className="text-gray-700">{request.clientId?.name}</p>
            </div>
          </div>
          {request.technicianId && (
            <div>
              <p className="text-sm font-medium text-gray-500">Técnico Asignado</p>
              <div className="flex items-center mt-1">
                <img
                  src={getAvatarUrl(request.technicianId?.name)}
                  alt={request.technicianId?.name || 'Técnico'}
                  className="h-8 w-8 rounded-full object-cover mr-2"
                />
                <p className="text-gray-700">{request.technicianId?.name}</p>
              </div>
            </div>
          )}
          {request.quotedPrice && (
            <div>
              <p className="text-sm font-medium text-gray-500">Precio Cotizado</p>
              <p className="text-lg font-semibold text-green-600 flex items-center mt-1">
                <DollarSign className="h-5 w-5 mr-1" /> ${request.quotedPrice}
              </p>
            </div>
          )}
        </div>

        {/* Actions for Technician */}
        {user?.type === 'technician' && request.status === 'pending' && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Cotizar Solicitud</h3>
            <div className="flex items-center mb-4">
              <label htmlFor="quotePrice" className="block text-sm font-medium text-gray-700 mr-4">
                Precio a Cotizar ($)
              </label>
              <input
                type="number"
                id="quotePrice"
                value={quotePrice}
                onChange={(e) => setQuotePrice(Number(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 150"
              />
            </div>
            <button
              onClick={() => handleUpdateStatus('quoted')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Enviar Cotización
            </button>
          </div>
        )}

        {/* Actions for Client */}
        {user?.type === 'client' && request.status === 'quoted' && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Acciones de Presupuesto</h3>
            <p className="text-gray-700 mb-4">
              El técnico ha cotizado este servicio por:
              <span className="text-2xl font-bold text-green-600 ml-2">${request.quotedPrice}</span>
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleUpdateStatus('accepted')}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Aceptar Presupuesto
              </button>
              <button
                onClick={() => handleUpdateStatus('rejected')}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Rechazar Presupuesto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
