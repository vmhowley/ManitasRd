import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Send } from 'lucide-react';
import { PriceCalculator } from '../components/PriceCalculator';
import { serviceRequestService } from '../services/serviceRequestService'; // Assuming this service handles standard requests
import { useAuth } from '../context/AuthContext';
import type { Service } from '../types/Service';
import { useToast } from '../context/ToastContext';

export const RequestService: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [serviceDetails, setServiceDetails] = useState<{ service: Service | null; total: number }>({ service: null, total: 0 });
  const [address, setAddress] = useState('');
  const [requestDate, setRequestDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePriceChange = useCallback((details: { service: Service | null; total: number }) => {
    setServiceDetails(details);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      showToast('Debes iniciar sesión para solicitar un servicio.', 'error');
      return;
    }
    if (!serviceDetails.service || serviceDetails.total <= 0) {
      showToast('Por favor, selecciona un servicio válido de la calculadora.', 'error');
      return;
    }
    if (!address || !requestDate) {
      showToast('Por favor, completa la dirección y la fecha.', 'error');
      return;
    }

    setLoading(true);

    const requestData = {
      category: serviceDetails.service.category,
      description: `Servicio estándar: ${serviceDetails.service.name}`,
      address,
      requestDate,
      finalPrice: serviceDetails.total,
      serviceId: serviceDetails.service._id,
      // Assuming your serviceRequest model can handle these fields
    };

    try {
      // You might need to create a new method in serviceRequestService for this
      await serviceRequestService.createStandardRequest(requestData);
      showToast('¡Servicio solicitado con éxito!', 'success');
      navigate('/client-home');
    } catch (err) {
      console.error('Error creating service request:', err);
      const errorMessage = 'Hubo un error al enviar tu solicitud. Inténtalo de nuevo.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Solicitar un Servicio</h1>
        <p className="text-gray-600 mb-8">Usa nuestra calculadora para servicios con precios fijos. Rápido, fácil y transparente.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Price Calculator Section */}
          <div className="p-6 border rounded-xl bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Calculadora de Precios</h2>
              <PriceCalculator onPriceChange={handlePriceChange} />
          </div>

          {/* Request Details Section */}
          {serviceDetails.service && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Completa los Detalles</h2>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Dirección del servicio</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Calle, número, sector..."
                      required
                    />
                </div>
              </div>
              <div>
                <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700 mb-2">Fecha deseada</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="requestDate"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading || !serviceDetails.service}
          >
            <Send className="h-5 w-5 mr-2" />
            {loading ? 'Enviando Solicitud...' : 'Confirmar y Solicitar Servicio'}
          </button>
        </form>
      </div>
    </div>
  );
};
