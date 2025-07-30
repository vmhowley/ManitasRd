import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ServiceCard, ServiceCardSkeleton } from '../../components/ServiceCard';
import { CartProvider } from '../../components/ServiceCartDrawer';

const ServiceCardExamplePage: React.FC = () => {
  // Sample services
  const services = [
    {
      id: '1',
      name: 'Reparación de Plomería',
      price: 1200,
      description: 'Servicio de reparación de tuberías, grifos y sistemas de plomería.',
      category: 'Plomería',
      rating: 4.8,
      eta: '1-2 horas',
      location: 'Santo Domingo',
    },
    {
      id: '2',
      name: 'Instalación Eléctrica',
      price: 1500,
      description: 'Instalación y reparación de sistemas eléctricos residenciales.',
      category: 'Electricidad',
      rating: 4.7,
      eta: '2-3 horas',
      location: 'Santiago',
    },
    {
      id: '3',
      name: 'Limpieza de Hogar',
      price: 800,
      description: 'Servicio completo de limpieza para hogares y apartamentos.',
      category: 'Limpieza',
      rating: 4.5,
      eta: '3-4 horas',
      location: 'La Romana',
    },
    {
      id: '4',
      name: 'Pintura Interior',
      price: 2500,
      description: 'Servicio de pintura para interiores con materiales incluidos.',
      category: 'Pintura',
      rating: 4.9,
      eta: '1-2 días',
      location: 'Puerto Plata',
    },
  ];

  return (
    <Layout>
      <CartProvider>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">Ejemplos de Tarjetas de Servicio</h1>
          
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Variante Predeterminada</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onSelect={() => alert(`Seleccionaste: ${service.name}`)} 
                />
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Variante Compacta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  variant="compact" 
                  onSelect={() => alert(`Seleccionaste: ${service.name}`)} 
                />
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Variante Destacada</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.slice(0, 2).map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  variant="featured" 
                  onSelect={() => alert(`Seleccionaste: ${service.name}`)} 
                />
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Estados de Carga (Skeletons)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ServiceCardSkeleton />
              <ServiceCardSkeleton />
              <ServiceCardSkeleton />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <ServiceCardSkeleton variant="compact" />
              <ServiceCardSkeleton variant="compact" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceCardSkeleton variant="featured" />
              <ServiceCardSkeleton variant="featured" />
            </div>
          </section>
        </div>
      </CartProvider>
    </Layout>
  );
};

export default ServiceCardExamplePage;