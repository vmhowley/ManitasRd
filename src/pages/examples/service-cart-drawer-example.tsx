import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ServiceCartExample } from '../../components/ServiceCartDrawer';

const ServiceCartDrawerExamplePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Ejemplo de Drawer de Carrito de Servicios</h1>
        
        <div className="p-6 border border-neutral-200 rounded-lg">
          <p className="mb-6">
            Este es un ejemplo de cómo se puede utilizar el componente ServiceCartDrawer para implementar
            un carrito de servicios. Los usuarios pueden agregar servicios al carrito y proceder al pago.
            Haga clic en el botón para abrir el drawer.
          </p>
          
          <ServiceCartExample />
        </div>
      </div>
    </Layout>
  );
};

export default ServiceCartDrawerExamplePage;