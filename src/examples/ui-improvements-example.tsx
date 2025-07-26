import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonButton } from '../components/ui/SkeletonLoader';
import { Home, Bell, ShieldCheck, Clock, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const UIImprovementsExample: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Ejemplo de migas de pan
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
    { label: 'Servicios', href: '/dashboard/services' },
    { label: 'Detalles del Servicio' },
  ];

  // Función para simular carga
  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-neutral-800">Mejoras de UI/UX</h1>
      
      {/* Sección de Migas de Pan */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-neutral-700">Sistema de Migas de Pan Mejorado</h2>
        <div className="p-4 border border-neutral-200 rounded-lg bg-white mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="p-4 border border-neutral-200 rounded-lg bg-white mb-4">
          <Breadcrumb 
            items={breadcrumbItems}
            autoGenerate={true} 
            routeMapping={{
              'dashboard': 'Panel Principal',
              'services': 'Servicios',
              'details': 'Detalles'
            }} 
          />
        </div>
      </section>

      {/* Sección de Skeleton Loaders */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-neutral-700">Estados de Carga Mejorados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-neutral-200 rounded-lg bg-white">
            <h3 className="text-lg font-medium mb-3 text-neutral-700">Skeleton Loaders</h3>
            <div className="space-y-4">
              <SkeletonText lines={3} className="mb-4" />
              <div className="flex items-center space-x-4">
                <SkeletonAvatar />
                <SkeletonText width="60%" />
              </div>
              <SkeletonCard height="120px" />
              <div className="flex justify-between">
                <SkeletonButton width="120px" />
                <SkeletonButton width="120px" />
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-neutral-200 rounded-lg bg-white">
            <h3 className="text-lg font-medium mb-3 text-neutral-700">Demostración en Vivo</h3>
            <div className="space-y-4">
              {loading ? (
                <>
                  <SkeletonText lines={2} />
                  <SkeletonCard height="120px" />
                  <div className="flex justify-end">
                    <SkeletonButton width="120px" />
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-2">Este es un ejemplo de contenido cargado.</p>
                  <p className="mb-4">Puedes ver la diferencia entre el estado de carga y el contenido real.</p>
                  <div className="bg-neutral-100 p-4 rounded-lg mb-4 h-[120px] flex items-center justify-center">
                    Contenido Principal
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={simulateLoading}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Simular Carga
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Sistema de Notificaciones */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-neutral-700">Sistema de Notificaciones Mejorado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-neutral-200 rounded-lg bg-white">
            <h3 className="text-lg font-medium mb-3 text-neutral-700">Tipos de Notificaciones</h3>
            <div className="space-y-3">
              <button 
                onClick={() => showToast('Operación completada con éxito', 'success', { title: 'Éxito' })}
                className="w-full px-4 py-2 bg-success text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Notificación de Éxito
              </button>
              
              <button 
                onClick={() => showToast('Ha ocurrido un error al procesar la solicitud', 'error', { title: 'Error' })}
                className="w-full px-4 py-2 bg-error text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
              >
                <XCircle className="h-4 w-4 mr-2" /> Notificación de Error
              </button>
              
              <button 
                onClick={() => showToast('Información importante sobre tu cuenta', 'info', { title: 'Información' })}
                className="w-full px-4 py-2 bg-info text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
              >
                <Info className="h-4 w-4 mr-2" /> Notificación Informativa
              </button>
              
              <button 
                onClick={() => showToast('Debes completar tu perfil antes de continuar', 'warning', { title: 'Advertencia' })}
                className="w-full px-4 py-2 bg-warning text-gray-900 rounded-md hover:bg-opacity-90 transition-colors flex items-center"
              >
                <AlertTriangle className="h-4 w-4 mr-2" /> Notificación de Advertencia
              </button>
            </div>
          </div>
          
          <div className="p-4 border border-neutral-200 rounded-lg bg-white">
            <h3 className="text-lg font-medium mb-3 text-neutral-700">Notificaciones Avanzadas</h3>
            <div className="space-y-3">
              <button 
                onClick={() => showToast('Tienes un nuevo mensaje', 'notification', { 
                  title: 'Nuevo Mensaje', 
                  position: 'top-right',
                  actionLabel: 'Ver Mensaje',
                  onAction: () => alert('Acción: Ver mensaje')
                })}
                className="w-full px-4 py-2 bg-accent-500 text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
              >
                <Bell className="h-4 w-4 mr-2" /> Con Acción
              </button>
              
              <button 
                onClick={() => showToast('Tu solicitud está siendo procesada', 'pending', { 
                  title: 'En Proceso', 
                  position: 'top-center',
                  duration: 10000
                })}
                className="w-full px-4 py-2 bg-neutral-500 text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
              >
                <Clock className="h-4 w-4 mr-2" /> Larga Duración (10s)
              </button>
              
              <button 
                onClick={() => showToast('Se ha detectado un inicio de sesión desde una nueva ubicación', 'security', { 
                  title: 'Alerta de Seguridad', 
                  position: 'bottom-left'
                })}
                className="w-full px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center"
              >
                <ShieldCheck className="h-4 w-4 mr-2" /> Posición Diferente
              </button>
              
              <button 
                onClick={() => {
                  showToast('Mensaje 1 - Posición Superior', 'info', { position: 'top-center' });
                  setTimeout(() => {
                    showToast('Mensaje 2 - Posición Derecha', 'success', { position: 'top-right' });
                  }, 500);
                  setTimeout(() => {
                    showToast('Mensaje 3 - Posición Izquierda', 'warning', { position: 'top-left' });
                  }, 1000);
                }}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Múltiples Posiciones
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UIImprovementsExample;