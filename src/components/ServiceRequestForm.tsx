import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, MapPin, Calendar, FileText, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { serviceRequestService } from '../services/serviceRequestService';
import { standardService } from '../services/standardService'; // Importar el servicio para obtener todos los servicios
import type { Service } from '../types/Service';
import { useToast } from '../context/ToastContext';



interface ServiceRequestFormProps {
  initialData?: {
    category?: string;
    description?: string;
    address?: string;
    urgency?: string;
    clientBudget?: number;
  };
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ initialData: propInitialData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = propInitialData || location.state?.initialData;
  const { user } = useAuth();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    description: initialData?.description || '',
    address: initialData?.address || user?.address || '',
    requestDate: '',
    fechaPreferida: '',
    urgency: initialData?.urgency || 'normal',
    clientBudget: initialData?.clientBudget?.toString() || '',
    selectedServiceId: '', // Nuevo estado para el ID del servicio seleccionado
  });
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await standardService.getAllServices();
        setAllServices(response.data);
        if (response.data.length === 0) {
          showToast('No se encontraron servicios activos. Por favor, asegúrate de que el backend esté funcionando y la base de datos tenga servicios.', 'error');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        showToast('Error al cargar los servicios.', 'error');
      }
    };
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    if (!searchTerm) {
      return allServices;
    }
    return allServices.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allServices, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceSelect = (service: Service) => {
    setFormData(prev => ({
      ...prev,
      category: service.category,
      description: service.name, // Usar el nombre del servicio como descripción inicial
      selectedServiceId: service._id, // Guardar el ID del servicio
    }));
    setSearchTerm(service.name); // Mostrar el nombre del servicio en el buscador
    nextStep(); // Avanzar al siguiente paso automáticamente
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.address || !formData.requestDate || !formData.selectedServiceId) {
      showToast('Por favor completa todos los campos requeridos y selecciona un servicio.', 'error');
      return;
    }

    if (!user || !user._id) {      
      showToast('Error: Usuario no autenticado. Por favor, inicia sesión.', 'error');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const requestDate = `${formData.requestDate}T${formData.fechaPreferida || '09:00'}`;

      const request = {
        category: formData.category,
        description: formData.description,
        address: formData.address,
        requestDate: requestDate,
        urgency: formData.urgency,
        clientBudget: formData.clientBudget ? parseFloat(formData.clientBudget) : undefined,
        serviceId: formData.selectedServiceId, // Enviar el ID del servicio seleccionado
      };

      await serviceRequestService.submitServiceRequest(request, user._id);
      showToast('Solicitud de servicio enviada con éxito!', 'success');
      navigate('/client-dashboard');
    } catch (error) {
      console.error('Error al enviar la solicitud de servicio:', error);
      showToast('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.selectedServiceId) {
      showToast('Por favor selecciona un servicio', 'error');
      return;
    }
    if (currentStep === 2 && !formData.description.trim()) {
      showToast('Por favor describe el problema', 'error');
      return;
    }
    if (currentStep === 3 && !formData.address.trim()) {
      showToast('Por favor ingresa la ubicación', 'error');
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/client-dashboard')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al dashboard
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Solicitar Servicio
          </h2>
          <p className="text-gray-600">
            Completa los siguientes pasos para solicitar tu servicio
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
          <div className="flex flex-wrap justify-between text-xs text-gray-600 mt-2">
            <span className="w-1/4 text-center">Servicio</span>
            <span className="w-1/4 text-center">Descripción</span>
            <span className="w-1/4 text-center">Ubicación</span>
            <span className="w-1/4 text-center">Fecha</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Busca y selecciona tu servicio</h3>
                  <p className="text-gray-600">Escribe para encontrar el servicio que necesitas</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar servicio por nombre, categoría o descripción..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <button
                        key={service._id}
                        type="button"
                        onClick={() => handleServiceSelect(service)}
                        className="w-full text-left p-4 border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors"
                      >
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.category} - {service.description}</p>
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-gray-500 text-center">No se encontraron servicios.</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: description */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Describe el problema</h3>
                  <p className="text-gray-600">Proporciona detalles específicos sobre lo que necesitas</p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del servicio *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Describe detalladamente el problema o servicio que necesitas..."
                  />
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de urgency
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="low">Baja - Puede esperar varios días</option>
                    <option value="normal">Normal - En los próximos días</option>
                    <option value="high">Alta - Lo antes posible</option>
                    <option value="emergency">Emergencia - Inmediato</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: address */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Ubicación del servicio</h3>
                  <p className="text-gray-600">¿Dónde necesitas el servicio?</p>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección completa *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Calle, número, sector, ciudad"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> La dirección será compartida con el técnico asignado únicamente después de confirmar el servicio.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Date and Time */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Fecha y hora preferida</h3>
                  <p className="text-gray-600">¿Cuándo te gustaría recibir el servicio?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha preferida *
                    </label>
                    <input
                      id="requestDate"
                      name="requestDate"
                      type="date"
                      required
                      min={getMinDate()}
                      value={formData.requestDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="fechaPreferida" className="block text-sm font-medium text-gray-700 mb-2">
                      Hora preferida
                    </label>
                    <select
                      id="fechaPreferida"
                      name="fechaPreferida"
                      value={formData.fechaPreferida}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Cualquier hora</option>
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="clientBudget" className="block text-sm font-medium text-gray-700 mb-2">
                      Presupuesto (opcional)
                    </label>
                    <input
                      id="clientBudget"
                      name="clientBudget"
                      type="number"
                      value={formData.clientBudget}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Ej: 100.00"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Resumen de tu solicitud</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Servicio:</span>
                      <span className="font-medium">{formData.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoría:</span>
                      <span className="font-medium">{formData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="font-medium">{formData.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">
                        {formData.requestDate ? new Date(formData.requestDate).toLocaleDateString() : 'No especificada'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hora:</span>
                      <span className="font-medium">{formData.fechaPreferida || 'Flexible'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};