import React, { useState } from 'react';
import { MapPin, Calculator } from 'lucide-react';

interface PriceCalculatorProps {
  onProceedToHire?: (data: { estimatedPrice: number; serviceType: string; location: string; urgency: string; materials: string; estimatedTime: number; }) => void;
}

const serviceHourlyRates: { [key: string]: number } = {
  'Plomería': 50,
  'Electricidad': 60,
  'Reparaciones': 45,
  'Pintura': 40,
  'Belleza': 35,
  'Automotriz': 55,
  'Limpieza': 30,
  'Tecnología': 70,
};

const materialCosts: { [key: string]: number } = {
  'none': 0,
  'basic': 20,
  'standard': 50,
  'premium': 100,
};

const urgencyFactors: { [key: string]: number } = {
  'low': 1.0,
  'medium': 1.2,
  'high': 1.5,
};

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ onProceedToHire }) => {
  const [serviceType, setServiceType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('low');
  const [materials, setMaterials] = useState<string>('none');
  const [estimatedTime, setEstimatedTime] = useState<number>(1);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<{ base: number; materials: number; urgency: number; location: number; } | null>(null);

  const handleCalculatePrice = () => {
    if (serviceType && location && estimatedTime > 0) {
      const baseHourlyRate = serviceHourlyRates[serviceType] || 0;
      const materialCost = materialCosts[materials] || 0;
      const urgencyFactor = urgencyFactors[urgency] || 1.0;

      let calculatedBasePrice = baseHourlyRate * estimatedTime;
      let price = calculatedBasePrice * urgencyFactor + materialCost;

      // Simple mock logic: add a location factor
      const locationFactor = location.toLowerCase().includes('santo domingo') ? 1.2 : 1.0;
      price *= locationFactor;

      setEstimatedPrice(parseFloat(price.toFixed(2)));
      setPriceBreakdown({
        base: parseFloat(calculatedBasePrice.toFixed(2)),
        materials: parseFloat(materialCost.toFixed(2)),
        urgency: parseFloat(urgencyFactor.toFixed(2)),
        location: parseFloat(locationFactor.toFixed(2)),
      });
    } else {
      setEstimatedPrice(null);
      setPriceBreakdown(null);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Calculator className="h-7 w-7 mr-3 text-blue-600" />
        Calculadora de Precios
      </h2>
      <p className="text-gray-600 mb-6">Obtén una estimación rápida del costo de tu servicio.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Servicio
          </label>
          <select
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona un servicio</option>
            {Object.keys(serviceHourlyRates).map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Tu Ubicación
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Santo Domingo"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
            Nivel de Urgencia
          </label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div>
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-2">
            Materiales
          </label>
          <select
            id="materials"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="none">Ninguno</option>
            <option value="basic">Básicos</option>
            <option value="standard">Estándar</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-2">
          Tiempo Estimado (horas)
        </label>
        <input
          type="number"
          id="estimatedTime"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(Number(e.target.value))}
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        onClick={handleCalculatePrice}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
      >
        Calcular Precio
      </button>

      {estimatedPrice !== null && priceBreakdown !== null && (
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-lg">
          <p className="font-medium mb-2">Detalle de la Estimación:</p>
          <ul className="text-sm mb-4">
            <li>Costo Base por Hora ({serviceType}): ${serviceHourlyRates[serviceType]}</li>
            <li>Tiempo Estimado: {estimatedTime} horas</li>
            <li>Costo de Materiales ({materials}): ${priceBreakdown.materials}</li>
            <li>Factor de Urgencia ({urgency}): x{priceBreakdown.urgency}</li>
            <li>Factor de Ubicación: x{priceBreakdown.location}</li>
          </ul>
          <div className="flex items-center justify-between">
            <p className="font-medium">Estimación Total: <span className="text-xl font-bold">${estimatedPrice}</span></p>
            {onProceedToHire && (
              <button
                onClick={() => onProceedToHire({
                  estimatedPrice,
                  serviceType,
                  location,
                  urgency,
                  materials,
                  estimatedTime,
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceder a Contratar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
