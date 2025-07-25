import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerProvider, DrawerTrigger } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { ServiceCartExample } from '../ServiceCartDrawer';
import { ChatExample } from '../ChatDrawer';
import { UserProfileExample } from '../UserProfileDrawer';
import { TechnicianDashboardExample } from '../TechnicianDashboardDrawer';
import { FilterDrawer } from '../FilterDrawer';
import { NotificationsDrawer } from '../NotificationsDrawer';
import { HelpProvider, useHelp, HelpButton } from '../HelpDrawer';

const DrawerShowcase: React.FC = () => {
  const [isBasicDrawerOpen, setIsBasicDrawerOpen] = useState(false);
  const [isPositionedDrawerOpen, setIsPositionedDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
  const [drawerSize, setDrawerSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');

  return (
    <HelpProvider>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Componentes de Drawer</h1>
        
        {/* Basic Drawer Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Drawer Básico</h2>
          <div className="p-6 border border-neutral-200 rounded-lg">
            <Button onClick={() => setIsBasicDrawerOpen(true)}>Abrir Drawer</Button>
            
            <Drawer
              isOpen={isBasicDrawerOpen}
              onClose={() => setIsBasicDrawerOpen(false)}
              position="right"
              size="md"
              title="Drawer Básico"
            >
              <div className="p-4">
                <p className="mb-4">Este es un ejemplo básico del componente Drawer.</p>
                <p className="mb-4">El componente Drawer es útil para mostrar contenido adicional o formularios sin tener que navegar a otra página.</p>
                <Button onClick={() => setIsBasicDrawerOpen(false)}>Cerrar</Button>
              </div>
            </Drawer>
          </div>
        </section>
        
        {/* Positioned Drawer Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Drawer con Posición y Tamaño</h2>
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Posición</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={drawerPosition === 'left' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setDrawerPosition('left')}
                  >
                    Izquierda
                  </Button>
                  <Button 
                    variant={drawerPosition === 'right' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setDrawerPosition('right')}
                  >
                    Derecha
                  </Button>
                  <Button 
                    variant={drawerPosition === 'top' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setDrawerPosition('top')}
                  >
                    Arriba
                  </Button>
                  <Button 
                    variant={drawerPosition === 'bottom' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setDrawerPosition('bottom')}
                  >
                    Abajo
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Tamaño</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={drawerSize === 'sm' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setDrawerSize('sm')}
                  >
                    Pequeño
                  </Button>
                  <Button 
                    variant={drawerSize === 'md' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setDrawerSize('md')}
                  >
                    Mediano
                  </Button>
                  <Button 
                    variant={drawerSize === 'lg' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setDrawerSize('lg')}
                  >
                    Grande
                  </Button>
                  <Button 
                    variant={drawerSize === 'xl' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setDrawerSize('xl')}
                  >
                    Extra Grande
                  </Button>
                  <Button 
                    variant={drawerSize === 'full' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setDrawerSize('full')}
                  >
                    Completo
                  </Button>
                </div>
              </div>
            </div>
            
            <Button onClick={() => setIsPositionedDrawerOpen(true)} className="mt-4">
              Abrir Drawer ({drawerPosition}, {drawerSize})
            </Button>
            
            <Drawer
              isOpen={isPositionedDrawerOpen}
              onClose={() => setIsPositionedDrawerOpen(false)}
              position={drawerPosition}
              size={drawerSize}
              title={`Drawer (${drawerPosition}, ${drawerSize})`}
            >
              <div className="p-4">
                <p className="mb-4">Este drawer está configurado con:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Posición: {drawerPosition}</li>
                  <li>Tamaño: {drawerSize}</li>
                </ul>
                <Button onClick={() => setIsPositionedDrawerOpen(false)}>Cerrar</Button>
              </div>
            </Drawer>
          </div>
        </section>
        
        {/* DrawerProvider Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Drawer con Provider</h2>
          <div className="p-6 border border-neutral-200 rounded-lg">
            <DrawerProvider>
              <p className="mb-4">El DrawerProvider permite abrir el drawer desde cualquier componente hijo sin pasar props.</p>
              
              <DrawerTrigger asChild>
                <Button>Abrir con DrawerTrigger</Button>
              </DrawerTrigger>
              
              <DrawerContent title="Drawer con Provider">
                <div className="p-4">
                  <p className="mb-4">Este drawer utiliza el contexto de DrawerProvider.</p>
                  <p className="mb-4">Esto facilita la apertura del drawer desde cualquier componente hijo sin tener que pasar props manualmente.</p>
                </div>
              </DrawerContent>
            </DrawerProvider>
          </div>
        </section>
        
        {/* Specialized Drawers */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Drawers Especializados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Cart */}
            <div className="p-6 border border-neutral-200 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Carrito de Servicios</h3>
              <p className="mb-4">Drawer para gestionar servicios seleccionados.</p>
              <ServiceCartExample />
            </div>
            
            {/* Chat */}
            <div className="p-6 border border-neutral-200 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Chat</h3>
              <p className="mb-4">Drawer para mensajería entre usuarios y técnicos.</p>
              <ChatExample />
            </div>
            
            {/* User Profile */}
            <div className="p-6 border border-neutral-200 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Perfil de Usuario</h3>
              <p className="mb-4">Drawer para gestionar el perfil y configuraciones.</p>
              <UserProfileExample />
            </div>
            
            {/* Technician Dashboard */}
            <div className="p-6 border border-neutral-200 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Panel de Técnico</h3>
              <p className="mb-4">Drawer con estadísticas y métricas para técnicos.</p>
              <TechnicianDashboardExample />
            </div>
          </div>
        </section>
        
        {/* Utility Drawers */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Drawers de Utilidad</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filter */}
            <div className="p-6 border border-neutral-200 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Filtros</h3>
              <p className="mb-4">Drawer para filtrar resultados de búsqueda.</p>
              <FilterDrawer 
                isOpen={false} 
                onClose={() => {}} 
                onApplyFilters={() => {}} 
                onClearFilters={() => {}} 
              />
            </div>
            
            {/* Notifications */}
            <div className="p-6 border border-neutral-200 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Notificaciones</h3>
              <p className="mb-4">Drawer para mostrar notificaciones del usuario.</p>
              <NotificationsDrawer 
                isOpen={false} 
                onClose={() => {}} 
                notifications={[]} 
                onMarkAsRead={() => {}} 
                onMarkAllAsRead={() => {}} 
                onDelete={() => {}} 
                onClearAll={() => {}} 
              />
            </div>
            
            {/* Help */}
            <div className="p-6 border border-neutral-200 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Ayuda Contextual</h3>
              <p className="mb-4">Drawer para mostrar ayuda contextual.</p>
              <HelpButton section="dashboard" />
            </div>
          </div>
        </section>
      </div>
    </HelpProvider>
  );
};

export default DrawerShowcase;