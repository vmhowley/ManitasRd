import { useState, useEffect, useMemo } from 'react';
import { Search, Wrench, Zap, Droplets, Paintbrush, Scissors, Car, Home as HomeIcon, Wifi, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { TechnicianCard } from '../components/TechnicianCard';
import { userService } from '../services/userService';
import type { User } from '../types/User';
import { useNavigate } from 'react-router-dom';

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
  const itemsPerPage = 3; // Adjust based on screen size if needed

  if (!technicians.length) return null;

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
          {technicians.slice(startIndex, endIndex).map((tech) => (
            <TechnicianCard key={tech._id} technician={tech} />
          ))}
        </div>
      </div>
    </section>
  );
};


export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        // For a real app, you'd fetch different lists for each category
        const data = await userService.getTechnicians();
        setTechnicians(data);
      } catch (err) {
        console.error('Error fetching technicians:', err);
        setError('No se pudieron cargar los técnicos.');
      } finally {
        setLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to a search results page or filter directly
    navigate(`/request-service?q=${searchQuery}`);
  };

  // Memoize technician lists to avoid re-sorting on every render
  const popularTechnicians = useMemo(() => {
    // Backend should ideally provide this list. For now, we shuffle.
    return [...technicians].sort(() => 0.5 - Math.random());
  }, [technicians]);

  const topRatedTechnicians = useMemo(() => {
    return [...technicians].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [technicians]);
  
  const nearbyTechnicians = useMemo(() => {
    // Placeholder: In a real app, this would use user's location data
    // For now, we just shuffle the list differently.
    return [...technicians].sort(() => Math.random() - 0.5);
  }, [technicians]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.pexels.com/photos/5691533/pexels-photo-5691533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Servicios a domicilio, <br />
            <span className="text-yellow-400">a un clic de distancia.</span>
          </h1>
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="¿Qué servicio necesitas? (ej. plomería, electricista)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 border-none rounded-full shadow-2xl text-lg text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Cargando técnicos...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      )}

      {/* Technician Carousels */}
      {!loading && !error && technicians.length > 0 && (
        <>
          <TechnicianCarousel title="Técnicos Populares" technicians={popularTechnicians} />
          <TechnicianCarousel title="Mejor Calificados" technicians={topRatedTechnicians} />
          <TechnicianCarousel title="Cerca de ti" technicians={nearbyTechnicians} />
        </>
      )}
      
      {/* No Technicians Found */}
      {!loading && !error && technicians.length === 0 && (
         <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No hay técnicos disponibles en este momento.</p>
          </div>
      )}

      <Footer />
    </div>
  );
};