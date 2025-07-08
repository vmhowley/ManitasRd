import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quoteRequestService, type QuoteRequest } from '../services/quoteRequestService';
import { ArrowLeft, Clock, DollarSign, MapPin, Send } from 'lucide-react';

export const TechnicianQuoteRequests: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuoteRequests = async () => {
      if (!user) {
        setError('Debes iniciar sesión para ver las solicitudes de presupuesto.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await quoteRequestService.getQuoteRequests();
        // Filter requests to show only pending ones or those quoted by the current technician
        const filtered = response.data.filter(req => 
          req.status === 'pending' || (req.status === 'quoted' && req.selectedTechnicianId?._id === user._id)
        );
        setQuoteRequests(filtered);
      } catch (err) {
        console.error('Error fetching quote requests:', err);
        setError('Hubo un error al cargar las solicitudes de presupuesto.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuoteRequests();
  }, [user]);

  const handleViewDetails = (requestId: string) => {
    // Navigate to a detailed view of the quote request
    navigate(`/quote-requests/${requestId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Cargando solicitudes de presupuesto...</p>
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

        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Send className="h-7 w-7 mr-3 text-blue-600" />
          Solicitudes de Presupuesto
        </h1>

        {quoteRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay solicitudes de presupuesto pendientes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quoteRequests.map((request) => (
              <div
                key={request._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{request.category}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{request.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'in_progress'
                          ? 'bg-purple-100 text-purple-800'
                          : request.status === 'quoted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {request.status === 'pending' ? 'Pendiente' : request.status === 'in_progress' ? 'En Progreso' : 'Cotizado'}
                    </span>
                    {request.status === 'quoted' && request.acceptedProposalId && (
                      <p className="text-lg font-bold text-green-600 mt-2 flex items-center">
                        <DollarSign className="h-5 w-5 mr-1" /> ${request.proposals.find(p => p._id === request.acceptedProposalId)?.totalPrice.toFixed(2)}
                      </p>
                    )}
                    <button
                      onClick={() => handleViewDetails(request._id)}
                      className="mt-2 text-blue-600 hover:underline text-sm"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
