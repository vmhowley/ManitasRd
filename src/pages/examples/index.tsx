import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { Link } from 'react-router-dom';

const ExamplesIndexPage: React.FC = () => {
  const examples = [
    {
      title: 'Showcase de Drawer',
      description: 'Muestra todos los componentes de Drawer disponibles en la aplicación.',
      path: '/examples/drawer-showcase'
    },
    {
      title: 'Drawer de Perfil de Usuario',
      description: 'Ejemplo de cómo utilizar el Drawer para mostrar y editar información de perfil.',
      path: '/examples/user-profile-drawer-example'
    },
    {
      title: 'Drawer de Chat',
      description: 'Ejemplo de cómo implementar un sistema de mensajería con Drawer.',
      path: '/examples/chat-drawer-example'
    },
    {
      title: 'Drawer de Carrito de Servicios',
      description: 'Ejemplo de cómo implementar un carrito de servicios con Drawer.',
      path: '/examples/service-cart-drawer-example'
    },
    {
      title: 'Drawer de Panel de Técnico',
      description: 'Ejemplo de cómo mostrar estadísticas y métricas para técnicos con Drawer.',
      path: '/examples/technician-dashboard-drawer-example'
    },
    {
      title: 'Drawer de Filtros',
      description: 'Ejemplo de cómo implementar filtros en una página de búsqueda con Drawer.',
      path: '/examples/filter-drawer-example'
    },
    {
      title: 'Drawer de Notificaciones',
      description: 'Ejemplo de cómo mostrar notificaciones al usuario con Drawer.',
      path: '/examples/notifications-drawer-example'
    },
    {
      title: 'Drawer de Ayuda',
      description: 'Ejemplo de cómo implementar un sistema de ayuda contextual con Drawer.',
      path: '/examples/help-drawer-example'
    },
    {
      title: 'Mejoras UI/UX',
      description: 'Demostración de las mejoras implementadas en UI/UX: migas de pan, skeleton loaders y notificaciones.',
      path: '/examples/ui-improvements-example'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Ejemplos de Componentes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <Link 
              key={index} 
              to={example.path}
              className="block p-6 border border-neutral-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <h2 className="text-xl font-semibold mb-2 text-primary-600">{example.title}</h2>
              <p className="text-neutral-600">{example.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ExamplesIndexPage;