import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ChatExample } from '../../components/ChatDrawer';

const ChatDrawerExamplePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Ejemplo de Drawer de Chat</h1>
        
        <div className="p-6 border border-neutral-200 rounded-lg">
          <p className="mb-6">
            Este es un ejemplo de cómo se puede utilizar el componente ChatDrawer para implementar
            un sistema de mensajería entre usuarios y técnicos. Haga clic en el botón para abrir el drawer.
          </p>
          
          <ChatExample />
        </div>
      </div>
    </Layout>
  );
};

export default ChatDrawerExamplePage;