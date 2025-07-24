import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { UserProfileExample } from '../../components/UserProfileDrawer';

const UserProfileDrawerExamplePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Ejemplo de Drawer de Perfil de Usuario</h1>
        
        <div className="p-6 border border-neutral-200 rounded-lg">
          <p className="mb-6">
            Este es un ejemplo de cómo se puede utilizar el componente UserProfileDrawer para mostrar y editar
            la información del perfil de un usuario. Haga clic en el botón para abrir el drawer.
          </p>
          
          <UserProfileExample />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfileDrawerExamplePage;