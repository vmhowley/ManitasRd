import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { TechnicianDashboardExample } from '../../components/TechnicianDashboardDrawer';

const TechnicianDashboardDrawerExamplePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Ejemplo de Drawer de Panel de Técnico</h1>
        
        <div className="p-6 border border-neutral-200 rounded-lg">
          <p className="mb-6">
            Este es un ejemplo de cómo se puede utilizar el componente TechnicianDashboardDrawer para mostrar
            estadísticas y métricas relevantes para los técnicos. Haga clic en el botón para abrir el drawer.
          </p>
          
          <TechnicianDashboardExample />
        </div>
      </div>
    </Layout>
  );
};

export default TechnicianDashboardDrawerExamplePage;