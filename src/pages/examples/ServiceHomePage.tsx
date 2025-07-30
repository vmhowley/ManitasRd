import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Layout } from '../../components/layout/Layout';

const ServiceHomePage: React.FC = () => {
  const navigate = useNavigate();
  const location ='Santo Domingo, RD'

  // Datos de ejemplo para servicios
  const services = [
    {
      id: 1,
      name: 'Plomería Profesional',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
      rating: 4.8,
      price: '$25-45/hr',
      category: 'Plomería',
      eta: '20-30 min',
    },
    {
      id: 2,
      name: 'Electricista Express',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
      rating: 4.9,
      price: '$30-50/hr',
      category: 'Electricidad',
      eta: '15-25 min',
    },
    {
      id: 3,
      name: 'Carpintería a Domicilio',
      image: 'https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
      rating: 4.7,
      price: '$35-60/hr',
      category: 'Carpintería',
      eta: '30-45 min',
    },
    {
      id: 4,
      name: 'Pintura Residencial',
      image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
      rating: 4.6,
      price: '$20-40/hr',
      category: 'Pintura',
      eta: '25-40 min',
    },
  ];

  // Categorías de servicios
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'plumbing', name: 'Plomería' },
    { id: 'electrical', name: 'Electricidad' },
    { id: 'carpentry', name: 'Carpintería' },
    { id: 'painting', name: 'Pintura' },
    { id: 'cleaning', name: 'Limpieza' },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Barra de ubicación */}
        <div className="flex items-center mb-6">
          <MapPin className="h-5 w-5 text-primary-500 mr-2" />
          <div className="flex-1">
            <p className="text-sm text-neutral-500">Ubicación actual</p>
            <p className="font-medium">{location}</p>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <Input
            placeholder="Buscar servicios..."
            leftIcon={<Search className="h-5 w-5" />}
            rightIcon={<Filter className="h-5 w-5" />}
            className="bg-neutral-100 border-0"
          />
        </div>

        {/* Banner promocional */}
        <div className="bg-primary-500 text-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">50% de descuento en tu primer servicio</h2>
          <p className="mb-4">Usa el código PRIMERA50 al solicitar</p>
          <Button variant="secondary" size="sm">
            Aplicar
          </Button>
        </div>

        {/* Categorías */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <Badge 
                key={category.id} 
                variant={category.id === 'all' ? 'secondary' : 'default'}
                className={`px-4 py-2 whitespace-nowrap ${category.id === 'all' ? 'bg-secondary-900' : 'bg-neutral-100'}`}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Lista de servicios */}
        <h2 className="text-xl font-bold mb-4">Servicios populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {services.map(service => (
            <Card 
              key={service.id} 
              variant="elevated" 
              padding="none" 
              className="overflow-hidden"
              onClick={() => navigate(`/examples/service-detail/${service.id}`)}
            >
              <div className="relative">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-40 object-cover"
                />
                <Badge 
                  variant="primary" 
                  className="absolute top-3 left-3 bg-primary-500"
                >
                  {service.category}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                  <span className="text-sm font-medium">{service.rating}</span>
                  <span className="mx-2 text-neutral-300">•</span>
                  <span className="text-sm text-neutral-500">{service.eta}</span>
                </div>
                <p className="font-medium text-primary-500">{service.price}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Sección de servicios destacados */}
        <h2 className="text-xl font-bold mb-4">Servicios de emergencia</h2>
        <Card variant="bordered" className="mb-4 bg-red-50 border-red-100">
          <div className="flex items-center">
            <div className="mr-4 p-3 bg-red-100 rounded-full">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Plomería de emergencia 24/7</h3>
              <p className="text-sm text-neutral-600">Respuesta en menos de 15 minutos</p>
            </div>
            <Button variant="danger" size="sm">
              Llamar ahora
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiceHomePage;