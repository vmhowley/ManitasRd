import { useState, useMemo, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
// --- Service Categories ---
const services = [
  { name: 'Reparaciones', icon: Wrench, color: 'text-green-500' },
  { name: 'Plomería', icon: Droplets, color: 'text-blue-500' },
  { name: 'Electricidad', icon: Zap, color: 'text-yellow-500' },
  { name: 'Pintura', icon: Paintbrush, color: 'text-purple-500' },
  { name: 'Belleza', icon: Scissors, color: 'text-pink-500' },
  { name: 'Automotriz', icon: Car, color: 'text-red-500' },
  { name: 'Limpieza', icon: HomeIcon, color: 'text-teal-500' },
  { name: 'Tecnología', icon: Wifi, color: 'text-indigo-600' },
];

// --- Reusable Technician Carousel Component ---
const TechnicianCarousel = ({ title, technicians, subtitle }: { title: string; technicians: User[]; subtitle?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Responsive items per page based on screen size
  const mobileItemsPerPage = 2;
  const tabletItemsPerPage = 3;
  const desktopItemsPerPage = 4;
  
  // Use window width to determine items per page
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [itemsPerPage, setItemsPerPage] = useState(
    windowWidth >= 1024 ? desktopItemsPerPage : 
    windowWidth >= 768 ? tabletItemsPerPage : 
    mobileItemsPerPage
  );

  // Update items per page when window resizes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setItemsPerPage(
        window.innerWidth >= 1024 ? desktopItemsPerPage : 
        window.innerWidth >= 768 ? tabletItemsPerPage : 
        mobileItemsPerPage
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <section className="">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
        </div>
        <Button 
          variant="link" 
          size="sm" 
          className="text-primary-600 dark:text-primary-400"
          rightIcon={<ArrowRight size={16} />}
        >
          Ver todo
        </Button>
      </div>
      
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-4">
          {technicians.slice(startIndex, Math.min(startIndex + itemsPerPage, technicians.length)).map((tech, index) => (
            <div key={index} className="flex-shrink-0 w-[85%] sm:w-[45%] md:w-[30%] lg:w-[23%] xl:w-[23%]">
              <TechnicianCard technician={tech} />
            </div>
          ))}
        </div>
        
        {technicians.length > itemsPerPage && (
          <div className="flex justify-center mt-4 gap-2">
            <button 
              onClick={prev} 
              className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50" 
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            </button>
            <button 
              onClick={next} 
              className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50" 
              disabled={endIndex >= technicians.length}
            >
              <ChevronRight className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
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
    <CartProvider>
      <div className="min-h-screen ">
        {/* Header with notification */}
        <header className=" mb-4 flex justify-between items-center ">
          <div className="flex items-center ">
            <div className="p-2 bg-white/10  md:w-10 md:h-10 rounded-full  flex items-center justify-center text-white mr-2">
              <HomeIcon size={18} className="md:h-5 md:w-5" />
            </div>
            <div className='grid grid-cols-1 gap-1'>

            <h2 className="font-semibold md:text-lg lg:text-xl dark:text-white">
              Bienvenido, 
            </h2>
              <span className="text-xs text-primary-600 dark:text-primary-400">
                👋{user?.name}
              </span>
            </div>
          </div>
          <div className="relative bg-white/10 p-2 rounded-full">
            <Bell
              size={20}
              className="text-neutral-600 dark:text-neutral-300 md:h-6 md:w-6"
            />
            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              3
            </span>
          </div>
        </header>

        {/* Hero Section with Promotion */}
        <section className="pt-4  max-w-7xl mx-auto">
          <Card className=" dark:bg-primary-500  text-white h-40">
            <CardContent className=" flex flex-col md:flex-row items-center">
              <div className="flex-1">
                <Badge
                  variant="warning"
                  className="mb-2 md:mb-4 dark:bg-amber-800 dark:text-amber-300"
                >
                  20% 🔥
                </Badge>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">
                  ¡Oferta Especial!
                </h2>
                <p className="text-sm md:text-base opacity-90 mb-3 md:mb-6 max-w-lg">
                  Obtén descuento en todos los servicios solo por hoy.
                </p>
               
              </div>
             
            </CardContent>
          </Card>

          {/* Search Bar */}
          <div className="mt-4 md:mt-6 relative max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="¿Qué servicio necesitas?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 md:pl-14 pr-4 py-3 md:py-4 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none md:text-lg dark:bg-neutral-800"
                />
              </div>
            </form>
          </div>

          {/* Quick Access */}
          {/* <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-center justify-between max-w-3xl mx-auto">
            <Badge className="bg-neutral-100 text-neutral-600 px-3 py-1 md:px-4 md:py-2 rounded-full md:text-base mb-2 md:mb-0">
              Todos los Servicios Disponibles
            </Badge>
            <div className="flex items-center">
              <MapPin
                size={16}
                className="text-primary-600 mr-1 md:h-5 md:w-5"
              />
              <span className="text-sm md:text-base text-neutral-600">
                Santo Domingo
              </span>
            </div>
          </div> */}
        </section>

        {/* Services Categories */}
        <section className=" lg:px-12  md:py-10  max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold dark:text-white">
              Categorías
            </h2>
            <Button
              variant="link"
              size="sm"
              className="text-primary-600 dark:text-primary-400 md:text-base"
              rightIcon={<ArrowRight size={16} className="md:h-5 md:w-5" />}
            >
              Ver todo
            </Button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.name}
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() =>
                    navigate(`/request-service?category=${service.name}`)
                  }
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`bg-white/10 rounded-2xl w-26 h-28 flex flex-col items-center justify-center  gap-4 `}
                    >
                      <IconComponent className={`${service.color} h-8 w-8 md:h-10 md:w-10 `} />
                      <h3 className="font-medium text-xs md:text-sm lg:text-base text-neutral-800 dark:text-neutral-200 text-center">
                        {service.name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Popular Services Section */}
        <section className=" max-w-7xl mb-4 mx-auto">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold dark:text-white">
              Servicios Populares
            </h2>
            <Button
              variant="link"
              size="sm"
              className="text-primary-600 dark:text-primary-400 md:text-base"
              rightIcon={<ArrowRight size={16} className="md:h-5 md:w-5" />}
            >
              Ver todo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {/* Popular Service Cards */}
            <ServiceCard
              service={{
                id: "1",
                name: "Limpieza",
                price: 800,
                category: "Limpieza",
                rating: 4.8,
                image:
                  "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
              }}
              variant="featured"
              onSelect={() => navigate("/request-service?category=Limpieza")}
              showAddToCart={false}
            />

            <ServiceCard
              service={{
                id: "2",
                name: "Plomería",
                price: 1200,
                category: "Plomería",
                rating: 4.7,
                image:
                  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e",
              }}
              variant="featured"
              onSelect={() => navigate("/request-service?category=Plomería")}
              showAddToCart={false}
            />

            {/* Solo visible en pantallas más grandes */}
            <div className="hidden lg:block">
              <ServiceCard
                service={{
                  id: "3",
                  name: "Electricidad",
                  price: 1000,
                  category: "Electricidad",
                  rating: 4.6,
                  image:
                    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4",
                }}
                variant="featured"
                onSelect={() =>
                  navigate("/request-service?category=Electricidad")
                }
                showAddToCart={false}
              />
            </div>

            {/* Solo visible en pantallas extra grandes */}
            <div className="hidden xl:block">
              <ServiceCard
                service={{
                  id: "4",
                  name: "Carpintería",
                  price: 950,
                  category: "Carpintería",
                  rating: 4.5,
                  image:
                    "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c",
                }}
                variant="featured"
                onSelect={() =>
                  navigate("/request-service?category=Carpintería")
                }
                showAddToCart={false}
              />
            </div>
          </div>
        </section>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center ">
            <p className="text-neutral-500">Cargando técnicos...</p>
          </div>
        )}
        {isError && (
          <div className="text-center ">
            <p className="text-red-600">Error: {error.message}</p>
          </div>
        )}

        {/* Technician Carousels */}
        {!isLoading && !isError && technicians.length > 0 && (
          <div className=''>
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
          </div>
        )}

        {/* No Technicians Found */}
        {!isLoading && !isError && technicians.length === 0 && (
          <div className="text-center ">
            <p className="text-neutral-500">
              No hay técnicos disponibles en este momento.
            </p>
          </div>
        )}

        {/* Post Job Request CTA */}
        <section className="mb-16 max-w-7xl mx-auto">
          <Card className="bg-neutral-100 rounded-2xl md:rounded-3xl overflow-hidden">
            <CardContent className="p-5 md:p-8 text-center md:flex md:items-center md:justify-between">
              <div className="md:text-left md:flex-1">
                <h3 className="font-bold text-lg md:text-xl lg:text-2xl mb-2 md:mb-3">
                  ¿No encontraste tu servicio?
                </h3>
                <p className="text-sm md:text-base text-neutral-600 mb-4 md:mb-0 md:max-w-xl">
                  No te preocupes, puedes publicar tus requerimientos y nuestros
                  técnicos te contactarán.
                </p>
              </div>
              <div className="md:ml-6 md:flex-shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-xl w-full md:w-auto md:px-8 md:py-3 md:text-base lg:text-lg"
                >
                  Publicar Solicitud
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </CartProvider>
  );
};