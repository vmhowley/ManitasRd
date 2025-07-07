import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Shield, Clock, CheckCircle, Phone, MessageCircle, Calendar, Wrench, Zap, Droplets, Paintbrush, Scissors, Car, Home as HomeIcon, Wifi, ChevronLeft, ChevronRight } from 'lucide-react';
import {Header} from '../components/layout/Header';
import {Footer} from '../components/layout/Footer';
import {TechnicianCard} from '../components/TechnicianCard';
import { userService } from '../services/userService';
import type { User } from '../types/User';
import { useNavigate } from 'react-router-dom';
const services = [
  { id: 1, name: 'Plomería', icon: Droplets, color: 'bg-blue-500', jobs: '2,450+' },
  { id: 2, name: 'Electricidad', icon: Zap, color: 'bg-yellow-500', jobs: '1,890+' },
  { id: 3, name: 'Reparaciones', icon: Wrench, color: 'bg-gray-600', jobs: '3,200+' },
  { id: 4, name: 'Pintura', icon: Paintbrush, color: 'bg-green-500', jobs: '1,540+' },
  { id: 5, name: 'Belleza', icon: Scissors, color: 'bg-pink-500', jobs: '980+' },
  { id: 6, name: 'Automotriz', icon: Car, color: 'bg-red-500', jobs: '1,200+' },
  { id: 7, name: 'Limpieza', icon: HomeIcon, color: 'bg-purple-500', jobs: '2,100+' },
  { id: 8, name: 'Tecnología', icon: Wifi, color: 'bg-indigo-500', jobs: '890+' },
];



export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTechIndex, setCurrentTechIndex] = useState(0);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await userService.getTechnicians();
        setTechnicians(data);
      } catch (err) {
        console.error('Error fetching technicians:', err);
        setError('Failed to load technicians.');
      } finally {
        setLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  const nextTechnician = () => {
    setCurrentTechIndex((prev) => (prev + 1) % technicians.length);
  };

  const prevTechnician = () => {
    setCurrentTechIndex((prev) => (prev - 1 + technicians.length) % technicians.length);
  };

  const handleSearch = () => {
    if (searchQuery.trim() || location.trim()) {
      console.log('Searching for:', searchQuery, 'in', location);
    }
  };

  const handleTechnicianSelect = (technician) => {
    navigate('login');
  };

  const handleTechnicianContact = (type) => {
    navigate('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                ¿Necesitas un técnico
                <span className="text-yellow-400"> en tu zona?</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Conectamos con técnicos verificados y certificados. Precios transparentes, garantía total.
              </p>
              
              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="¿Qué servicio necesitas?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tu ubicación"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-400" />
                  <span>Técnicos Verificados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span>Garantía Total</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-400" />
                  <span>Disponible 24/7</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/8844896/pexels-photo-8844896.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1" 
                  alt="Técnico profesional"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">+15,000</p>
                      <p className="text-sm text-gray-600">Servicios Completados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Technicians Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Técnicos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Profesionales verificados con las mejores calificaciones
            </p>
          </div>

          <div className="relative">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Cargando técnicos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : technicians.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No hay técnicos disponibles en este momento.</p>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <button
                  onClick={prevTechnician}
                  className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
                  {technicians.slice(currentTechIndex, currentTechIndex + 3).map((tech) => (
                    <TechnicianCard
                      key={tech._id}
                      technician={tech}
                      onSelect={handleTechnicianSelect}
                      onContact={handleTechnicianContact}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTechnician}
                  className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            )}

            {/* Carousel Indicators */}
            {technicians.length > 0 && (
              <div className="flex justify-center mt-8 space-x-2">
                {technicians.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTechIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTechIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Categorías de Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra el técnico perfecto para cualquier trabajo en tu hogar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="group cursor-pointer"
                  onClick={() => onNavigate('login')}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                    <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.jobs} trabajos</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Tres simples pasos para obtener el servicio que necesitas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Busca y Reserva</h3>
              <p className="text-gray-600">
                Encuentra el técnico perfecto, ve precios transparentes y reserva en segundos
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Programa tu Cita</h3>
              <p className="text-gray-600">
                Elige el horario que mejor te convenga, incluso el mismo día
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Trabajo Completado</h3>
              <p className="text-gray-600">
                Recibe un servicio de calidad con garantía y califica tu experiencia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ventajas de usar ManitasRD
            </h2>
            <p className="text-xl text-blue-100">
              Somos diferentes a otras plataformas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Verificados</h3>
              <p className="text-blue-100 text-sm">Todos nuestros técnicos pasan por verificación exhaustiva</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Garantía Total</h3>
              <p className="text-blue-100 text-sm">Garantizamos la calidad de cada trabajo realizado</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Disponible 24/7</h3>
              <p className="text-blue-100 text-sm">Servicios de emergencia disponibles todo el día</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Precios Justos</h3>
              <p className="text-blue-100 text-sm">Tarifas transparentes sin sorpresas al final</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

