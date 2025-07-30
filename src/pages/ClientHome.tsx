import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Wrench, Zap, Droplets, Paintbrush, Scissors, Car, Home as HomeIcon, Wifi, ChevronLeft, ChevronRight, Plus, FileText, Clock, Star } from 'lucide-react';
import { TechnicianCard } from '../components/TechnicianCard';
import { userService } from '../services/userService';
import type { User } from '../types/User';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Service Categories ---
const services = [
  { name: 'Plomería', icon: Droplets },
  { name: 'Electricidad', icon: Zap },
  { name: 'Reparaciones', icon: Wrench },
  { name: 'Pintura', icon: Paintbrush },
  { name: 'Belleza', icon: Scissors },
  { name: 'Automotriz', icon: Car },
  { name: 'Limpieza', icon: HomeIcon },
  { name: 'Tecnología', icon: Wifi },
];

// --- Reusable Technician Carousel Component ---
const TechnicianCarousel = ({ title, technicians }: { title: string; technicians: User[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  if (!technicians || technicians.length === 0) return null;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(technicians.length / itemsPerPage));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(technicians.length / itemsPerPage)) % Math.ceil(technicians.length / itemsPerPage));
  };
  
  const startIndex = currentIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            <button onClick={prev} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50" disabled={currentIndex === 0}>
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button onClick={next} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50" disabled={endIndex >= technicians.length}>
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technicians.slice(startIndex, endIndex).map((tech, index) => (
            <TechnicianCard key={index} technician={tech} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const ClientHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: technicians = [], isLoading, isError, error } = useQuery<User[], Error>({
    queryKey: ['technicians'],
    queryFn: userService.getTechnicians,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/request-service?q=${searchQuery}`);
  };

  const popularTechnicians = useMemo(() => {
    return [...technicians].sort(() => 0.5 - Math.random());
  }, [technicians]);

  const topRatedTechnicians = useMemo(() => {
    return [...technicians].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [technicians]);
  
  const nearbyTechnicians = useMemo(() => {
    return [...technicians].sort(() => Math.random() - 0.5);
  }, [technicians]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section for Clients */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ¡Hola {user?.name}! 👋
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              ¿Qué servicio necesitas hoy?
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button
              onClick={() => navigate('/request-service')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Solicitar Servicio Estándar
            </button>
            <button
              onClick={() => navigate('/request-quote')}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 transition-colors flex items-center justify-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              Solicitar Presupuesto Personalizado
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="¿Qué servicio necesitas? (ej. plomería, electricista)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 border rounded-full shadow-lg text-lg text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-shadow"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Quick Stats for Client */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Respuesta Rápida</h3>
              <p className="text-gray-600">Técnicos disponibles en menos de 30 minutos</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Calidad Garantizada</h3>
              <p className="text-gray-600">Técnicos verificados y calificados</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Wrench className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Servicios Completos</h3>
              <p className="text-gray-600">Desde reparaciones hasta proyectos personalizados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Servicios Disponibles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6 text-center">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.name}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/request-service?category=${service.name}`)}
                >
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500 transition-all duration-300">
                    <IconComponent className="h-10 w-10 text-gray-700 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800">{service.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Cargando técnicos...</p>
        </div>
      )}
      {isError && (
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">Error: {error.message}</p>
        </div>
      )}

      {/* Technician Carousels */}
      {!isLoading && !isError && technicians.length > 0 && (
        <>
          <TechnicianCarousel title="Técnicos Recomendados para Ti" technicians={topRatedTechnicians} />
          <TechnicianCarousel title="Técnicos Populares" technicians={popularTechnicians} />
          <TechnicianCarousel title="Cerca de Ti" technicians={nearbyTechnicians} />
        </>
      )}
      
      {/* No Technicians Found */}
      {!isLoading && !isError && technicians.length === 0 && (
         <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No hay técnicos disponibles en este momento.</p>
          </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">¿Listo para solicitar tu servicio?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Conecta con técnicos profesionales en tu área y resuelve tus necesidades hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/client-dashboard')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver Mis Solicitudes
            </button>
            <button
              onClick={() => navigate('/request-service')}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              Solicitar Servicio Ahora
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};