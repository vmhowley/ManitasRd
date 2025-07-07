import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { serviceRequestService } from '../services/serviceRequestService';

const serviceCategories = [
  'Electricidad',
  'Plomería',
  'Refrigeración',
  'Reparaciones Generales',
  'Pintura',
  'Limpieza',
  'Jardinería',
  'Carpintería',
  'Cerrajería',
  'Tecnología'
];

export const ServiceRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    address: user?.address || '',
    requestDate: '',
    fechaPreferida: '',
    urgency: 'normal',
    clientBudget: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.address || !formData.requestDate) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (!user || !user._id) {      
      alert('Error: Usuario no autenticado. Por favor, inicia sesión.');
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
      };

      await serviceRequestService.submitServiceRequest(request, user._id);
      alert('Solicitud de servicio enviada con éxito!');
      navigate('/client-dashboard');
    } catch (error) {
      console.error('Error al enviar la solicitud de servicio:', error);
      alert('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.category) {
      alert('Por favor selecciona una categoría de servicio');
      return;
    }
    if (currentStep === 2 && !formData.description.trim()) {
      alert('Por favor describe el problema');
      return;
    }
    if (currentStep === 3 && !formData.address.trim()) {
      alert('Por favor ingresa la ubicación');
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
            <span className="w-1/4 text-center">Categoría</span>
            <span className="w-1/4 text-center">Descripción</span>
            <span className="w-1/4 text-center">Ubicación</span>
            <span className="w-1/4 text-center">Fecha</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: category Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Selecciona el tipo de servicio</h3>
                  <p className="text-gray-600">¿Qué tipo de trabajo necesitas?</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {serviceCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category }))}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.category === category
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{category}</span>
                    </button>
                  ))}
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