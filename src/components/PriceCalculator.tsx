import { useState, useEffect, useMemo } from 'react';
import { standardService } from '../services/standardService';
import type { Service, PriceModifier } from '../types/Service';
import { DollarSign, Tag, ChevronDown, Loader2 } from 'lucide-react';

interface PriceCalculatorProps {
  onPriceChange: (details: { service: Service | null; total: number }) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ onPriceChange }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedModifiers, setSelectedModifiers] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState<number>(1); // New state for quantity

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await standardService.getAllServices();
        setServices(response.data);
      } catch {
        setError('No se pudieron cargar los servicios.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const selectedService = useMemo(() => services.find(s => s._id === selectedServiceId), [services, selectedServiceId]);

  const total = useMemo(() => {
    if (!selectedService) return 0;

    let servicePrice = selectedService.basePrice;
    if (selectedService.unitType && selectedService.pricePerUnit) {
      servicePrice = selectedService.pricePerUnit * quantity;
    }

    const modifiersCost = selectedService.priceModifiers
      ? selectedService.priceModifiers.filter(m => m._id && selectedModifiers.has(m._id))
          .reduce((sum: number, m: PriceModifier) => sum + m.additionalCost, 0)
      : 0;

    return servicePrice + modifiersCost;
  }, [selectedService, selectedModifiers, quantity]); // Add quantity to dependencies

  useEffect(() => {
    onPriceChange({ service: selectedService || null, total });
  }, [selectedService, total, onPriceChange]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServiceId(e.target.value);
    setSelectedModifiers(new Set()); // Reset modifiers when service changes
  };

  const handleModifierChange = (modifierId: string) => {
    setSelectedModifiers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modifierId)) {
        newSet.delete(modifierId);
      } else {
        newSet.add(modifierId);
      }
      return newSet;
    });
  };

  const servicesByCategory = useMemo(() => {
    return services.reduce<Record<string, Service[]>>((acc, service) => {
      (acc[service.category] = acc[service.category] || []).push(service);
      return acc;
    }, {});
  }, [services]);

  if (loading) {
    return <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin mr-2" /> Cargando servicios...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6 p-1">
      <div>
        <label htmlFor="service-category" className="block text-sm font-medium text-gray-700 mb-2">1. Elige el servicio</label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            id="service-category"
            value={selectedServiceId}
            onChange={handleServiceChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Selecciona un servicio --</option>
            {Object.entries(servicesByCategory).map(([category, services]) => (
              <optgroup label={category} key={category}>
                {services.map(service => (
                  <option key={service._id} value={service._id}>{service.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {selectedService && (
        <div className="space-y-4">
          <p className="text-gray-600">{selectedService.description}</p>

          {selectedService.unitType && (
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Cantidad ({selectedService.unitType})</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          {selectedService.priceModifiers && selectedService.priceModifiers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">2. Personaliza tu servicio (Opcional)</h4>
              <div className="space-y-2">
                {selectedService.priceModifiers.map((modifier: PriceModifier) => (
                  <label key={modifier._id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modifier._id ? selectedModifiers.has(modifier._id) : false}
                      onChange={() => modifier._id && handleModifierChange(modifier._id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-800">{modifier.name}</span>
                    <span className="ml-auto text-sm font-medium text-green-600">+RD${modifier.additionalCost.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-dashed">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Precio Total Estimado:</h3>
              <p className="text-2xl font-bold text-blue-600 flex items-center">
                <DollarSign className="h-6 w-6 mr-1" />
                {total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};