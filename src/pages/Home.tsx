import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Wrench, Zap, Droplets, Paintbrush, Scissors, Car, Home as HomeIcon, Wifi, ChevronLeft, ChevronRight, Bell, MapPin, ArrowRight } from 'lucide-react';
import { TechnicianCard } from '../components/TechnicianCard';
import { ServiceCard } from '../components/ServiceCard';
import { CartProvider } from '../components/ServiceCartDrawer';
import { userService } from '../services/userService';
import type { User } from '../types/User';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';

// --- Service Categories ---
const services = [
  { name: 'Reparaciones', icon: Wrench, color: 'bg-green-500' },
  { name: 'Plomería', icon: Droplets, color: 'bg-blue-500' },
  { name: 'Electricidad', icon: Zap, color: 'bg-yellow-500' },
  { name: 'Pintura', icon: Paintbrush, color: 'bg-purple-500' },
  { name: 'Belleza', icon: Scissors, color: 'bg-pink-500' },
  { name: 'Automotriz', icon: Car, color: 'bg-red-500' },
  { name: 'Limpieza', icon: HomeIcon, color: 'bg-teal-500' },
  { name: 'Tecnología', icon: Wifi, color: 'bg-indigo-600' },
];

// --- Reusable Technician Carousel Component ---
const TechnicianCarousel = ({ title, technicians, subtitle }: { title: string; technicians: User[]; subtitle?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2; // Show fewer items per page for mobile-first design

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
    <section className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
          {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
        </div>
        <Button 
          variant="link" 
          size="sm" 
          className="text-primary-600"
          rightIcon={<ArrowRight size={16} />}
        >
          Ver todo
        </Button>
      </div>
      
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-4">
          {technicians.slice(startIndex, Math.min(startIndex + 4, technicians.length)).map((tech, index) => (
            <div key={index} className="flex-shrink-0 w-[85%] max-w-[280px]">
              <TechnicianCard technician={tech} />
            </div>
          ))}
        </div>
        
        {technicians.length > itemsPerPage && (
          <div className="flex justify-center mt-4 gap-2">
            <button 
              onClick={prev} 
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors disabled:opacity-50" 
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5 text-neutral-700" />
            </button>
            <button 
              onClick={next} 
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors disabled:opacity-50" 
              disabled={endIndex >= technicians.length}
            >
              <ChevronRight className="h-5 w-5 text-neutral-700" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// Add CSS to hide scrollbar but allow scrolling
const scrollbarStyles = document.createElement('style');
scrollbarStyles.textContent = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;
document.head.appendChild(scrollbarStyles);


export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
    <CartProvider>
    <div className="min-h-screen bg-neutral-50">
      {/* Header with notification */}
      <header className="bg-white py-3 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white mr-2">
            <HomeIcon size={18} />
          </div>
          <h2 className="font-semibold">Bienvenido, <span className="text-primary-600">Usuario</span></h2>
        </div>
        <div className="relative">
          <Bell size={20} className="text-neutral-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">3</span>
        </div>
      </header>

      {/* Hero Section with Promotion */}
      <section className="px-4 pt-4 pb-6">
        <Card className="bg-primary-600 text-white overflow-hidden rounded-3xl">
          <CardContent className="p-6 flex items-center">
            <div className="flex-1">
              <Badge variant="warning" className="mb-2">20% 🔥</Badge>
              <h2 className="text-xl font-bold mb-1">¡Oferta Especial!</h2>
              <p className="text-sm opacity-90 mb-3">Obtén descuento en todos los servicios solo por hoy.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                rightIcon={<ArrowRight size={16} />}
              >
                Ver más
              </Button>
            </div>
            <div className="ml-4">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/4661/4661321.png" 
                alt="Técnico" 
                className="w-20 h-20 object-contain" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="¿Qué servicio necesitas?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-2xl shadow-sm text-neutral-800 placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Quick Access */}
        <div className="mt-4 flex items-center justify-between">
          <Badge className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full">Todos los Servicios Disponibles</Badge>
          <div className="flex items-center">
            <MapPin size={16} className="text-primary-600 mr-1" />
            <span className="text-sm text-neutral-600">Santo Domingo</span>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="px-4 py-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Categorías</h2>
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary-600"
            rightIcon={<ArrowRight size={16} />}
          >
            Ver todo
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.name}
                className="cursor-pointer"
                onClick={() => navigate(`/request-service?category=${service.name}`)}
              >
                <div className="flex flex-col items-center">
                  <div className={`${service.color} rounded-2xl w-16 h-16 flex items-center justify-center mb-2 shadow-sm`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-medium text-xs text-neutral-800 text-center">{service.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Popular Services Section */}
      <section className="px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Servicios Populares</h2>
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary-600"
            rightIcon={<ArrowRight size={16} />}
          >
            Ver todo
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Popular Service Cards */}
          <ServiceCard 
            service={{
              id: '1',
              name: 'Limpieza',
              price: 800,
              category: 'Limpieza',
              rating: 4.8,
              image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952'
            }}
            variant="featured"
            onSelect={() => navigate('/request-service?category=Limpieza')}
            showAddToCart={false}
          />
          
          <ServiceCard 
            service={{
              id: '2',
              name: 'Plomería',
              price: 1200,
              category: 'Plomería',
              rating: 4.7,
              image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e'
            }}
            variant="featured"
            onSelect={() => navigate('/request-service?category=Plomería')}
            showAddToCart={false}
          />
        </div>
      </section>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-6 px-4">
          <p className="text-neutral-500">Cargando técnicos...</p>
        </div>
      )}
      {isError && (
        <div className="text-center py-6 px-4">
          <p className="text-red-600">Error: {error.message}</p>
        </div>
      )}

      {/* Technician Carousels */}
      {!isLoading && !isError && technicians.length > 0 && (
        <>
          <TechnicianCarousel 
            title="Técnicos Populares" 
            subtitle="Los más solicitados por los usuarios"
            technicians={popularTechnicians} 
          />
          <TechnicianCarousel 
            title="Mejor Calificados" 
            subtitle="Con las mejores reseñas"
            technicians={topRatedTechnicians} 
          />
          <TechnicianCarousel 
            title="Cerca de ti" 
            subtitle="Disponibles en tu zona"
            technicians={nearbyTechnicians} 
          />
        </>
      )}
      
      {/* No Technicians Found */}
      {!isLoading && !isError && technicians.length === 0 && (
         <div className="text-center py-10 px-4">
            <p className="text-neutral-500">No hay técnicos disponibles en este momento.</p>
          </div>
      )}
      
      {/* Post Job Request CTA */}
      <section className="px-4 py-6 mb-16">
        <Card className="bg-neutral-100 rounded-2xl">
          <CardContent className="p-5 text-center">
            <h3 className="font-bold mb-2">¿No encontraste tu servicio?</h3>
            <p className="text-sm text-neutral-600 mb-4">No te preocupes, puedes publicar tus requerimientos.</p>
            <Button 
              variant="primary" 
              size="md" 
              className="rounded-xl w-full"
            >
              Publicar Solicitud
            </Button>
          </CardContent>
        </Card>
      </section>

    </div>
    </CartProvider>
  );
};