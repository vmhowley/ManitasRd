import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Send } from 'lucide-react';
import { PriceCalculator } from '../components/PriceCalculator';
import { CustomQuoteRequest } from './CustomQuoteRequest';

export const RequestService: React.FC = () => {
  const navigate = useNavigate();
  const [showCalculator, setShowCalculator] = useState(true);

  const handleProceedToHire = (data: { estimatedPrice: number; serviceType: string; location: string; urgency: string; materials: string; estimatedTime: number; }) => {
    console.log('Proceeding to hire with estimated data:', data);
    navigate('/service-request', { state: { initialData: {
      category: data.serviceType,
      address: data.location,
      urgency: data.urgency,
      clientBudget: data.estimatedPrice,
      description: `Servicio de ${data.serviceType} con ${data.estimatedTime} horas estimadas y materiales ${data.materials}. Urgencia: ${data.urgency}. Precio estimado: ${data.estimatedPrice}`,
    } }});
  };

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

        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          ¿Cómo quieres solicitar tu servicio?
        </h1>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setShowCalculator(true)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
              showCalculator
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculadora de Precios
          </button>
          <button
            onClick={() => setShowCalculator(false)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
              !showCalculator
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Send className="h-5 w-5 mr-2" />
            Presupuesto Personalizado
          </button>
        </div>

        {showCalculator ? (
          <PriceCalculator onProceedToHire={handleProceedToHire} />
        ) : (
          <CustomQuoteRequest />
        )}
      </div>
    </div>
  );
};
