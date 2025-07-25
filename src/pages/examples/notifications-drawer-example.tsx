import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { NotificationsDrawer } from '../../components/NotificationsDrawer';
import { Button } from '../../components/ui/Button';

const NotificationsDrawerExamplePage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };



  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Ejemplo de Drawer de Notificaciones</h1>
        
        <div className="p-6 border border-neutral-200 rounded-lg mb-8">
          <p className="mb-6">
            Este es un ejemplo de cómo se puede utilizar el componente NotificationsDrawer para mostrar
            notificaciones al usuario. Haga clic en el botón para abrir el drawer.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setIsDrawerOpen(true)}>Ver Notificaciones ({notifications.filter(n => !n.read).length})</Button>
          </div>
          
          <NotificationsDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
          />
        </div>
        
        {/* Mostrar notificaciones actuales */}
        <div className="p-6 border border-neutral-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Notificaciones Actuales</h2>
          
          {notifications.length === 0 ? (
            <p>No hay notificaciones.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => {
                const bgColors = {
                  info: 'bg-blue-50 border-blue-200',
                  success: 'bg-green-50 border-green-200',
                  warning: 'bg-yellow-50 border-yellow-200',
                  error: 'bg-red-50 border-red-200'
                };
                
                return (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg ${bgColors[notification.type]} ${!notification.read ? 'font-medium' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-neutral-500">{notification.time}</span>
                    </div>
                    <p className="mt-1">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs">
                        {notification.read ? 'Leída' : 'No leída'}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(notification.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex gap-4 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleMarkAllAsRead}
                  disabled={notifications.every(n => n.read)}
                >
                  Marcar Todas Como Leídas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearAll}
                >
                  Eliminar Todas
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsDrawerExamplePage;