import { Bell, Check, Trash2, X } from 'lucide-react';
import { DrawerContent, DrawerProvider, DrawerTrigger } from './ui/Drawer';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsDrawerProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationsDrawer = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}: NotificationsDrawerProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Type-based styling
  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'error':
        return 'bg-danger-50 border-danger-200';
      case 'info':
      default:
        return 'bg-info-50 border-info-200';
    }
  };
  
  return (
    <DrawerProvider>
      <DrawerTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="danger" 
              size="sm" 
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        position="right"
        size="md"
        title="Notificaciones"
        footer={
          notifications.length > 0 ? (
            <div className="flex justify-between w-full">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClearAll}
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Borrar todas
              </Button>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onMarkAllAsRead}
                  leftIcon={<Check className="h-4 w-4" />}
                >
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          ) : null
        }
      >
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
            <Bell className="h-12 w-12 mb-4 text-neutral-300" />
            <p className="text-center">No tienes notificaciones</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`
                  relative p-3 rounded-lg border 
                  ${notification.read ? 'bg-white border-neutral-200' : getTypeStyles(notification.type)}
                  transition-colors duration-200
                `}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${notification.read ? 'text-neutral-700' : 'text-neutral-900'}`}>
                    {notification.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-neutral-500 hover:text-neutral-700 p-1"
                        onClick={() => onMarkAsRead(notification.id)}
                        aria-label="Marcar como leída"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-neutral-500 hover:text-neutral-700 p-1"
                      onClick={() => onDelete(notification.id)}
                      aria-label="Eliminar notificación"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className={`text-sm mt-1 ${notification.read ? 'text-neutral-600' : 'text-neutral-800'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-neutral-500 mt-2">{notification.time}</p>
              </div>
            ))}
          </div>
        )}
      </DrawerContent>
    </DrawerProvider>
  );
};