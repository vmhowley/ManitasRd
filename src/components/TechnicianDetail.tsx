import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, CheckCircle, Clock, Award, Shield, Calendar } from 'lucide-react';
import { User } from '../App';

interface TechnicianDetailProps {
  technician: any;
  onNavigate: (page: string) => void;
  user: User | null;
}

export default function TechnicianDetail({ technician, onNavigate, user }: TechnicianDetailProps) {
  const [selectedService, setSelectedService] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  if (!technician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Técnico no encontrado</p>
          <button
            onClick={() => onNavigate('landing')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const services = [
    { name: 'Reparación básica', price: '$25/hora', duration: '1-2 horas' },
    { name: 'Instalación', price: '$35/hora', duration: '2-4 horas' },
    { name: 'Mantenimiento', price: '$30/hora', duration: '1-3 horas' },
    { name: 'Emergencia', price: '$50/hora', duration: 'Inmediato' }
  ];

  const reviews = [
    {
      id: 1,
      name: 'María González',
      rating: 5,
      comment: 'Excelente trabajo, muy profesional y puntual. Resolvió el problema rápidamente.',
      date: '2024-01-15',
      service: 'Plomería'
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      rating: 5,
      comment: 'Muy recomendado. Llegó a tiempo y el trabajo quedó perfecto.',
      date: '2024-01-10',
      service: 'Electricidad'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      rating: 4,
      comment: 'Buen servicio, aunque tardó un poco más de lo esperado.',
      date: '2024-01-05',
      service: 'Reparaciones'
    }
  ];

  const handleServiceRequest = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    onNavigate('service-request');
  };

  const handleContact = (type: 'phone' | 'chat') => {
    if (!user) {
      onNavigate('login');
      return;
    }
    
    if (type === 'chat') {
      onNavigate('messaging');
    } else {
      setShowContactModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Technician Profile */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <img
                    src={technician.image}
                    alt={technician.name}
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                  {technician.verified && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{technician.name}</h1>
                    {technician.verified && (
                      <Shield className="h-6 w-6 text-green-500 ml-2" />
                    )}
                  </div>
                  
                  <p className="text-xl text-blue-600 font-medium mb-3">{technician.specialty}</p>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold text-lg">{technician.rating}</span>
                      <span className="text-gray-500 ml-1">({technician.reviews} reseñas)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-1" />
                      <span>{technician.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-900">{technician.price}</span>
                    <div className="flex items-center text-green-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">Disponible ahora</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Verificado
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Respuesta rápida
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  5+ años experiencia
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  Garantía incluida
                </span>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acerca de {technician.name}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Técnico especializado en {technician.specialty.toLowerCase()} con más de 5 años de experiencia. 
                Certificado por las principales instituciones del sector y con un historial comprobado de 
                excelencia en el servicio. Me especializo en resolver problemas complejos de manera eficiente 
                y con garantía total en todos mis trabajos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Certificado</p>
                  <p className="text-sm text-gray-600">Técnico profesional</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Asegurado</p>
                  <p className="text-sm text-gray-600">Cobertura completa</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Garantía</p>
                  <p className="text-sm text-gray-600">30 días</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Servicios Disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedService === service.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedService(service.name)}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{service.price}</span>
                      <span>{service.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reseñas de Clientes</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <p className="text-sm text-gray-600">{review.service}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactar Técnico</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleServiceRequest}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Solicitar Servicio
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleContact('phone')}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </button>
                  <button
                    onClick={() => handleContact('chat')}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Disponibilidad</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lun - Vie:</span>
                    <span className="text-gray-900">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sábado:</span>
                    <span className="text-gray-900">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domingo:</span>
                    <span className="text-gray-900">Solo emergencias</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Tiempo de respuesta</h4>
                <div className="flex items-center text-green-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">Responde en menos de 1 hora</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trabajos completados</span>
                  <span className="font-semibold text-gray-900">324</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tasa de satisfacción</span>
                  <span className="font-semibold text-green-600">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tiempo en plataforma</span>
                  <span className="font-semibold text-gray-900">2 años</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recontratación</span>
                  <span className="font-semibold text-blue-600">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactar por teléfono</h3>
            <p className="text-gray-600 mb-4">
              Para contactar directamente con {technician.name}, puedes llamar al:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
              <p className="text-2xl font-bold text-blue-600">+1 (555) 123-4567</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  window.open('tel:+15551234567');
                  setShowContactModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Llamar ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}